from typing import List  # noqa: I001
import logging
from flask import abort, render_template, request, url_for, current_app as app
from flask_restx import Namespace, Resource
from sqlalchemy.sql import and_
from sqlalchemy.exc import OperationalError
import json
from PIL import Image
from io import BytesIO
import base64
import sqlite3
from CTFd.utils.events import EventManager
from CTFd.api.v1.helpers.request import validate_args
from CTFd.api.v1.notifications import outgoingNotificationPost
from CTFd.api.v1.helpers.schemas import sqlalchemy_to_pydantic
from CTFd.api.v1.schemas import APIDetailedSuccessResponse, APIListSuccessResponse
from CTFd.cache import clear_challenges, clear_standings
from CTFd.constants import RawEnum
from CTFd.models import ChallengeFiles as ChallengeFilesModel
from CTFd.models import Challenges, Teams
from CTFd.models import ChallengeTopics as ChallengeTopicsModel
from CTFd.models import Fails, Flags, Hints, HintUnlocks, Solves, Submissions, Tags, db, Users
from CTFd.plugins.challenges import CHALLENGE_CLASSES, get_chal_class
from CTFd.plugins.flash_challenges import FlashChallenge
from CTFd.schemas.challenges import ChallengeSchema
from CTFd.schemas.flags import FlagSchema
from CTFd.schemas.hints import HintSchema
from CTFd.schemas.tags import TagSchema
from CTFd.utils import config, get_config
from CTFd.utils import user as current_user
from CTFd.utils.challenges import (
    get_all_challenges,
    get_solve_counts_for_challenges,
    get_solve_ids_for_user_id,
    get_solves_for_challenge_id,
)
from CTFd.utils.config.visibility import (
    accounts_visible,
    challenges_visible,
    scores_visible,
)
from CTFd.utils.dates import ctf_ended, ctf_paused, ctftime
from CTFd.utils.decorators import (
    admins_only,
    during_ctf_time_only,
    require_verified_emails,
)
from CTFd.utils.decorators.visibility import (
    check_challenge_visibility,
    check_score_visibility,
)
from CTFd.utils.humanize.words import pluralize
from CTFd.utils.logging import log
from CTFd.utils.security.signing import serialize
from CTFd.utils.user import (
    authed,
    get_current_team,
    get_current_team_attrs,
    get_current_user,
    get_current_user_attrs,
    is_admin,
)
import datetime
import time
from threading import Timer
from datetime import datetime, timedelta



def flashTimerFonction(challenge_id, time, app_):
        print(challenge_id)
        print(app_)
        with app_:
            
            challenge = FlashChallenge.query.filter_by(id=challenge_id).first_or_404()
            #checker si le defi a deja ete shout
            if not challenge.shout:

                # le cas ou le timer aurais ete reduit et que on a une autre instance qui roulait quand meme

                #checker si le challenge existe encore

                #checker si le temps est toujours le bon

                if time - 3 < challenge.startTime and  time + 3 > challenge.startTime and challenge.state ==  "visible":

                    #checker si le defi est encore visible
                   
                    req = {'title': 'Nouveau défi Flash disponible !', 'content': challenge.name + " : " + str(challenge.value) +" points", 'type': 'toast', 'sound': True}
                    challenge.shout = True
                    outgoingNotificationPost(req)
    


def announceFlashChallenge(challenge, time=-1):
        
    
    challengeFlash = FlashChallenge.query.filter_by(id=challenge.id).first_or_404()
    x= datetime.fromtimestamp(time if not time == -1 else challengeFlash.startTime)
    y = datetime.now()
    delta_t=x-y
    
    secs=delta_t.total_seconds()
   
    with app.app_context() as w:
        with w:
            t = Timer(secs, (lambda : flashTimerFonction(challenge.id, time, w)))
            t.start()

    return True

try:
    # app.events_manager = EventManager()
    # with app.app_context():
    
    for challenge in FlashChallenge.query.filter_by(shout=False).all():
        announceFlashChallenge(challenge, FlashChallenge.query.filter_by(id=challenge.id).first_or_404().startTime)
except (OperationalError, sqlite3.OperationalError):
    print("The flash_challenge table does not exist yet. Skipping query.")


def resize_image(image_data, size=(100, 100)):
    # Open the image
    image = Image.open(BytesIO(image_data))
    # Resize the image while maintaining aspect ratio
    image.thumbnail(size, Image.ANTIALIAS)
    # Save the image to a BytesIO object
    output = BytesIO()
    image.save(output, format='PNG')
    # Get the binary content of the image
    return output.getvalue()

def outgoingPost(request):
    submission_id = -1
    request_data = request.get_json() or request.form 
    challenge_id = request_data.get("challenge_id")

    isJson = False
    if request_data.get("submission"):
        try:
            submission = request_data["submission"].strip()
            isJson = True
        except (AttributeError):
            submission = request_data["submission"]
    
    if current_user.is_admin():
        preview = request.args.get("preview", False)
        if preview:
            challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
            chal_class = get_chal_class(challenge.type)
            status, message = chal_class.attempt(challenge, request)

            return {
                "success": True,
                "data": {
                    "status": "correct" if status else "incorrect",
                    "message": message,
                },
            }

    if ctf_paused():
        return (
            {
                "success": True,
                "data": {
                    "status": "paused",
                    "message": "{} is paused".format(config.ctf_name()),
                },
            },
            403,
        )
   
    user = get_current_user()
    team = get_current_team()
   
    # TODO: Convert this into a re-useable decorator
    if config.is_teams_mode() and team is None:
        abort(403)

    fails = Fails.query.filter_by(
        account_id=user.account_id, challenge_id=challenge_id
    ).count()
    
  
    challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
   
    if challenge.state == "hidden":
        abort(404)

    if challenge.state == "locked":
        abort(403)
    
    if challenge.requirements:
        requirements = challenge.requirements.get("prerequisites", [])
        solve_ids = (
            Solves.query.with_entities(Solves.challenge_id)
            .filter_by(account_id=user.account_id)
            .order_by(Solves.challenge_id.asc())
            .all()
        )
        solve_ids = {solve_id for solve_id, in solve_ids}
        # Gather all challenge IDs so that we can determine invalid challenge prereqs
        all_challenge_ids = {
            c.id for c in Challenges.query.with_entities(Challenges.id).all()
        }
        prereqs = set(requirements).intersection(all_challenge_ids)
        if solve_ids >= prereqs:
            pass
        else:
            abort(403)

    chal_class = get_chal_class(challenge.type)

    # Anti-bruteforce / submitting Flags too quickly
    kpm = current_user.get_wrong_submissions_per_minute(user.account_id)
    kpm_limit = int(get_config("incorrect_submissions_per_min", default=10))
    if kpm > kpm_limit:
        if ctftime():
            submission_id = chal_class.fail(
                user=user, team=team, challenge=challenge, request=request
            )
            
        log(
            "submissions",
            "[{date}] {name} submitted {submission} on {challenge_id} with kpm {kpm} [TOO FAST]",
            name=user.name,
            submission=request_data.get("submission", "").encode("utf-8"),
            challenge_id=challenge_id,
            kpm=kpm,
        )
        # Submitting too fast
        return (
            {
                "success": True,
                "data": {
                    "status": "ratelimited",
                    "message": "You're submitting flags too fast. Slow down.",
                },
            },
            429,
        )
 
    solves = Solves.query.filter_by(
        account_id=user.account_id, challenge_id=challenge_id
    ).first()
    
    failsPerTeam = Fails.query.filter_by(
        account_id=user.account_id, challenge_id=challenge_id
    ).first()
    alreadyBlockForSubmition = False
    if not failsPerTeam:
        alreadyBlockForSubmition = False
    else:
        if chal_class.name != "manualRecursive":
            alreadyBlockForSubmition = True

    if not solves or chal_class.name == "manualRecursive":
        if not alreadyBlockForSubmition:
            # Hit max attempts
            max_tries = challenge.max_attempts
            if max_tries and fails >= max_tries > 0:
                return (
                    {
                        "success": True,
                        "data": {
                            "status": "incorrect",
                            "message": "You have 0 tries remaining",
                        },
                    },
                    403,
                )
           
            status, message = chal_class.attempt(challenge, request)
   
            if status:  # The challenge plugin says the input is right
               

                if ctftime() or current_user.is_admin():
                    chal_class.solve(
                        user=user, team=team, challenge=challenge, request=request
                    )
                    clear_standings()
                    clear_challenges()
              
                log(
                    "submissions",
                    "[{date}] {name} submitted {submission} on {challenge_id} with kpm {kpm} [CORRECT]",
                    name=user.name,
                    submission=(submission if isJson else  json.dumps(submission)).encode("utf-8"),
                    challenge_id=challenge_id,
                    kpm=kpm,
                )
                
                return {
                    "success": True,
                    "data": {"status": "correct", "message": message},
                }
            else:  # The challenge plugin says the input is wrong
             
                if ctftime() or current_user.is_admin():
                    if chal_class.name != "flash":
                        submission_id = chal_class.fail(
                            user=user, team=team, challenge=challenge, request=request
                        )
                        clear_standings()
                        clear_challenges()
                    else:
                        if FlashChallenge.query.filter_by(id=challenge.id).first_or_404().endTime > time.time() and FlashChallenge.query.filter_by(id=challenge.id).first_or_404().startTime < time.time():
                            submission_id = chal_class.fail(
                            user=user, team=team, challenge=challenge, request=request
                            )
                            clear_standings()
                            clear_challenges()
                        
                        else:
                            return {
                                    "success": False,
                                    "data": {"status": "incorrect", "message": message, "submission_id":submission_id},
                                }
              

                log(
                    "submissions",
                    "[{date}] {name} submitted {submission} on {challenge_id} with kpm {kpm} [WRONG]",
                    name=user.name,
                    submission=(submission if isJson else  json.dumps(submission)).encode("utf-8"),
                    challenge_id=challenge_id,
                    kpm=kpm,
                )
             
                if max_tries:
                    # Off by one since fails has changed since it was gotten
                    attempts_left = max_tries - fails - 1
                    tries_str = pluralize(attempts_left, singular="try", plural="tries")
                    # Add a punctuation mark if there isn't one
                    if message[-1] not in "!().;?[]{}":
                        message = message + "."
                    return {
                        "success": True,
                        "data": {
                            "status": "incorrect",
                            "message": "{} You have {} {} remaining.".format(
                                message, attempts_left, tries_str
                            ),
                        },
                    }
                else:
                    return {
                        "success": True,
                        "data": {"status": "incorrect", "message": message, "submission_id":submission_id},
                    }
       
        else:
            log(
            "submissions",
            "[{date}] {name} submitted {submission} on {challenge_id} with kpm {kpm} [ALREADY SUBMITED]",
            name=user.name,
            submission=(submission if isJson else  json.dumps(submission)).encode("utf-8"),
            challenge_id=challenge_id,
            kpm=kpm,
        )
        
        return {
            "success": True,
            "data": {
                "status": "already_submited",
                "message": "You already submited this",
            },
        }
    # Challenge already solved
    else:
        log(
            "submissions",
            "[{date}] {name} submitted {submission} on {challenge_id} with kpm {kpm} [ALREADY SOLVED]",
            name=user.name,
            submission=(submission if isJson else  json.dumps(submission)).encode("utf-8"),
            challenge_id=challenge_id,
            kpm=kpm,
        )
     
        return {
            "success": True,
            "data": {
                "status": "already_solved",
                "message": "You already solved this",
            },
        }


challenges_namespace = Namespace(
    "challenges", description="Endpoint to retrieve Challenges"
)

ChallengeModel = sqlalchemy_to_pydantic(
    Challenges, include={"solves": int, "solved_by_me": bool}
)
TransientChallengeModel = sqlalchemy_to_pydantic(Challenges, exclude=["id"])


class ChallengeDetailedSuccessResponse(APIDetailedSuccessResponse):
    data: ChallengeModel


class ChallengeListSuccessResponse(APIListSuccessResponse):
    data: List[ChallengeModel]


challenges_namespace.schema_model(
    "ChallengeDetailedSuccessResponse", ChallengeDetailedSuccessResponse.apidoc()
)

challenges_namespace.schema_model(
    "ChallengeListSuccessResponse", ChallengeListSuccessResponse.apidoc()
)


@challenges_namespace.route("")
class ChallengeList(Resource):
    @check_challenge_visibility
    @during_ctf_time_only
    @require_verified_emails
    @challenges_namespace.doc(
        description="Endpoint to get Challenge objects in bulk",
        responses={
            200: ("Success", "ChallengeListSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    @validate_args(
        {
            "name": (str, None),
            "max_attempts": (int, None),
            "value": (int, None),
            "category": (str, None),
            "type": (str, None),
            "state": (str, None),
            "q": (str, None),
            "thumbsnail": (str, None),
            "field": (
                RawEnum(
                    "ChallengeFields",
                    {
                        "name": "name",
                        "description": "description",
                        "category": "category",
                        "type": "type",
                        "state": "state",
                        "thumbsnail": "thumbsnail",
                    },
                ),
                None,
            ),
        },
        location="query",
    )
    def get(self, query_args):
        # Require a team if in teams mode
        # TODO: Convert this into a re-useable decorator
        # TODO: The require_team decorator doesnt work because of no admin passthru
        if get_current_user_attrs():
            if is_admin():
                pass
            else:
                if config.is_teams_mode() and get_current_team_attrs() is None:
                    abort(403)

        # Build filtering queries
        q = query_args.pop("q", None)
        field = str(query_args.pop("field", None))

        # Admins get a shortcut to see all challenges despite pre-requisites
        admin_view = is_admin() and request.args.get("view") == "admin"

        # Get a cached mapping of challenge_id to solve_count
        solve_counts = get_solve_counts_for_challenges(admin=admin_view)

        # Get list of solve_ids for current user
        if authed():
            user = get_current_user()
            user_solves = get_solve_ids_for_user_id(user_id=user.id)
        else:
            user_solves = set()

        # Aggregate the query results into the hashes defined at the top of
        # this block for later use
        if scores_visible() and accounts_visible():
            solve_count_dfl = 0
        else:
            # Empty out the solves_count if we're hiding scores/accounts
            solve_counts = {}
            # This is necessary to match the challenge detail API which returns
            # `None` for the solve count if visiblity checks fail
            solve_count_dfl = None

        chal_q = get_all_challenges(admin=admin_view, field=field, q=q, **query_args)

        # Iterate through the list of challenges, adding to the object which
        # will be JSONified back to the client
        response = []
        tag_schema = TagSchema(view="user", many=True)
        
        # Gather all challenge IDs so that we can determine invalid challenge prereqs
        all_challenge_ids = {
            c.id for c in Challenges.query.with_entities(Challenges.id).all()
        }
        
                
        for challenge in chal_q:
            if challenge.requirements:
                requirements = challenge.requirements.get("prerequisites", [])
                anonymize = challenge.requirements.get("anonymize")
                prereqs = set(requirements).intersection(all_challenge_ids)
                if user_solves >= prereqs or admin_view:
                    pass
                else:
                    if anonymize:
                        response.append(
                            {
                                "id": challenge.id,
                                "type": "hidden",
                                "name": "???",
                                "value": 0,
                                "solves": None,
                                "solved_by_me": False,
                                "category": "???",
                                "tags": [],
                                "template": "",
                                "script": "",
                            }
                        )
                    # Fallthrough to continue
                    continue

            try:
                challenge_type = get_chal_class(challenge.type)
            except KeyError:
                # Challenge type does not exist. Fall through to next challenge.
                continue
            
            team = get_current_team()
            user_submited = {}
            is_submited = False
            provided = False
            team_id = False
            
            
            if team != None:
                team_id = team.id
                for fail in team.fails:
                    if (challenge_type.name == "manual" or challenge_type.name == "manualRecursive"or challenge_type.name == "flash") and fail.challenge_id == challenge.id:
                    
                        is_submited = True
                        break
                    else:
                        is_submited = False

            
                            
            #check if we have some specified ids to returned
        
            response.append(
                {
                    "id": challenge.id,
                    "type": challenge_type.name,
                    "name": challenge.name,
                    "value": challenge.value,
                    "team_id":team_id,
                    "provided": provided,
                    "solves": solve_counts.get(challenge.id, solve_count_dfl),
                    "solved_by_me": challenge.id in user_solves,
                    "thumbsnail" : challenge.thumbsnail,
                    "submited" : is_submited,
                    "category": challenge.category,
                    "tags": tag_schema.dump(challenge.tags).data,
                    "template": challenge_type.templates["view"],
                    "script": challenge_type.scripts["view"],
                   
                }
            )
            if challenge_type.name == "flash":
                response[-1]["startTime"] = FlashChallenge.query.filter_by(id=challenge.id).first_or_404().startTime
                response[-1]["endTime"] = FlashChallenge.query.filter_by(id=challenge.id).first_or_404().endTime

                if FlashChallenge.query.filter_by(id=challenge.id).first_or_404().startTime > time.time():
                    response.pop()
             
            
            
        for i in range(len(response)):
            if response[i]["type"]== "flash":
                
                for e in range(len(response)):
                    if response[e]["type"]== "flash":
                        if response[e]["endTime"] > response[i]["endTime"] or response[e]["endTime"] < time.time():
                            response.insert(e,response[i])
                            response.pop(i+1)
                            break
                    else:
                        response.insert(e,response[i])
                        response.pop(i+1)
                        break

        db.session.close()
        return {"success": True, "data": response}

    @admins_only
    @challenges_namespace.doc(
        description="Endpoint to create a Challenge object",
        responses={
            200: ("Success", "ChallengeDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def post(self):
        data = request.form or request.get_json()
        # logging.info(f"Received form data: {data}")
       

        thumbsnail_file = request.files.get('thumbsnail')
      
    
        if thumbsnail_file:
            thumbsnail_data = thumbsnail_file.read()
            resized_thumbsnail_data = resize_image(thumbsnail_data)
            # Encode resized image to base64
            resized_thumbsnail_b64 = base64.b64encode(resized_thumbsnail_data).decode('utf-8')
            # Create a data URL
            data['thumbsnail'] = f"data:image/png;base64,{resized_thumbsnail_b64}"
        
        # Load data through schema for validation but not for insertion
        schema = ChallengeSchema()
        response = schema.load(data)
        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        challenge_type = data["type"]
        challenge_class = get_chal_class(challenge_type)
        challenge = challenge_class.create(request)
        
        if challenge.type == "flash":
            challenge.shout = False
            announceFlashChallenge(challenge, FlashChallenge.query.filter_by(id=challenge.id).first_or_404().startTime)

        response = challenge_class.read(challenge)

        clear_challenges()

        return {"success": True, "data": response}




@challenges_namespace.route("/types")
class ChallengeTypes(Resource):
    @admins_only
    def get(self):
        response = {}

        for class_id in CHALLENGE_CLASSES:
            challenge_class = CHALLENGE_CLASSES.get(class_id)
            response[challenge_class.id] = {
                "id": challenge_class.id,
                "name": challenge_class.name,
                "templates": challenge_class.templates,
                "scripts": challenge_class.scripts,
                "create": render_template(
                    challenge_class.templates["create"].lstrip("/")
                ),
            }
        return {"success": True, "data": response}


@challenges_namespace.route("/<challenge_id>")
class Challenge(Resource):
    @check_challenge_visibility
    @during_ctf_time_only
    @require_verified_emails
    @challenges_namespace.doc(
        description="Endpoint to get a specific Challenge object",
        responses={
            200: ("Success", "ChallengeDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def get(self, challenge_id):
        if is_admin():
            chal = Challenges.query.filter(Challenges.id == challenge_id).first_or_404()
        else:
            chal = Challenges.query.filter(
                Challenges.id == challenge_id,
                and_(Challenges.state != "hidden", Challenges.state != "locked"),
            ).first_or_404()

        try:
            chal_class = get_chal_class(chal.type)
        except KeyError:
            abort(
                500,
                f"The underlying challenge type ({chal.type}) is not installed. This challenge can not be loaded.",
            )

        if chal.requirements:
            requirements = chal.requirements.get("prerequisites", [])
            anonymize = chal.requirements.get("anonymize")
            # Gather all challenge IDs so that we can determine invalid challenge prereqs
            all_challenge_ids = {
                c.id for c in Challenges.query.with_entities(Challenges.id).all()
            }
            if challenges_visible():
                user = get_current_user()
                if user:
                    solve_ids = (
                        Solves.query.with_entities(Solves.challenge_id)
                        .filter_by(account_id=user.account_id)
                        .order_by(Solves.challenge_id.asc())
                        .all()
                    )
                else:
                    # We need to handle the case where a user is viewing challenges anonymously
                    solve_ids = []
                solve_ids = {value for value, in solve_ids}
                prereqs = set(requirements).intersection(all_challenge_ids)
                if solve_ids >= prereqs or is_admin():
                    pass
                else:
                    if anonymize:
                        return {
                            "success": True,
                            "data": {
                                "id": chal.id,
                                "type": "hidden",
                                "name": "???",
                                "value": 0,
                                "solves": None,
                                "solved_by_me": False,
                                "category": "???",
                                "tags": [],
                                "template": "",
                                "script": "",
                            },
                        }
                    abort(403)
            else:
                abort(403)

        tags = [
            tag["value"] for tag in TagSchema("user", many=True).dump(chal.tags).data
        ]

        unlocked_hints = set()
        hints = []
        if authed():
            user = get_current_user()
            team = get_current_team()

            # TODO: Convert this into a re-useable decorator
            if is_admin():
                pass
            else:
                if config.is_teams_mode() and team is None:
                    abort(403)

            unlocked_hints = {
                u.target
                for u in HintUnlocks.query.filter_by(
                    type="hints", account_id=user.account_id
                )
            }
            files = []
            for f in chal.files:
                token = {
                    "user_id": user.id,
                    "team_id": team.id if team else None,
                    "file_id": f.id,
                }
                files.append(
                    url_for("views.files", path=f.location, token=serialize(token))
                )
        else:
            files = [url_for("views.files", path=f.location) for f in chal.files]

        for hint in Hints.query.filter_by(challenge_id=chal.id).all():
            if hint.id in unlocked_hints or ctf_ended():
                hints.append(
                    {"id": hint.id, "cost": hint.cost, "content": hint.content}
                )
            else:
                hints.append({"id": hint.id, "cost": hint.cost})

        response = chal_class.read(challenge=chal)

        # Get list of solve_ids for current user
        if authed():
            user = get_current_user()
            user_solves = get_solve_ids_for_user_id(user_id=user.id)
        else:
            user_solves = []

        solves_count = get_solve_counts_for_challenges(challenge_id=chal.id)
        if solves_count:
            challenge_id = chal.id
            solve_count = solves_count.get(chal.id)
            solved_by_user = challenge_id in user_solves
        else:
            solve_count, solved_by_user = 0, False

        # Hide solve counts if we are hiding solves/accounts
        if scores_visible() is False or accounts_visible() is False:
            solve_count = None

        if authed():
            # Get current attempts for the user
            attempts = Submissions.query.filter_by(
                account_id=user.account_id, challenge_id=challenge_id
            ).count()
        else:
            attempts = 0

        response["solves"] = solve_count
        response["solved_by_me"] = solved_by_user
        response["attempts"] = attempts
        response["files"] = files
        response["tags"] = tags
        response["hints"] = hints

        response["view"] = render_template(
            chal_class.templates["view"].lstrip("/"),
            solves=solve_count,
            solved_by_me=solved_by_user,
            files=files,
            tags=tags,
            hints=[Hints(**h) for h in hints],
            max_attempts=chal.max_attempts,
            attempts=attempts,
            challenge=chal,
        )

        db.session.close()
        return {"success": True, "data": response}

    @admins_only
    @challenges_namespace.doc(
        description="Endpoint to edit a specific Challenge object",
        responses={
            200: ("Success", "ChallengeDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def patch(self, challenge_id):
        data = request.get_json()
        
        print(data)
        # Load data through schema for validation but not for insertion
        schema = ChallengeSchema()
        response = schema.load(data)
        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
        challenge_class = get_chal_class(challenge.type)
        startTime = 0
        if challenge.type == "flash":
            challengeFlash = FlashChallenge.query.filter_by(id=challenge_id).first_or_404()
            startTime = challengeFlash.startTime
            if int(data["startTime"]) > startTime:
                    challengeFlash.shout = False

        challenge = challenge_class.update(challenge, request)
        response = challenge_class.read(challenge)
        clear_standings()
        clear_challenges()

        if challenge.type == "flash":
            challengeFlash = FlashChallenge.query.filter_by(id=challenge_id).first_or_404()
            if int(data["startTime"]) != startTime:
                
                    
                announceFlashChallenge(challenge, int(data["startTime"]))
                
       
        
        

        

        

        return {"success": True, "data": response}

    @admins_only
    @challenges_namespace.doc(
        description="Endpoint to delete a specific Challenge object",
        responses={200: ("Success", "APISimpleSuccessResponse")},
    )
    def delete(self, challenge_id):
        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
        chal_class = get_chal_class(challenge.type)
        chal_class.delete(challenge)

        clear_standings()
        clear_challenges()

        return {"success": True}


@challenges_namespace.route("/<challenge_id>/thumbsnail")
class ChallengeThumbsnail(Resource):
    @admins_only
    def patch(self, challenge_id):
        data = request.get_json()
        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
        
        thumbsnail_url = data["thumbsnail"]
        try:
            challenge.thumbsnail = thumbsnail_url
            db.session.commit()
            clear_challenges()
            return {"success": True, "data": {"thumbsnail": thumbsnail_url}}
        except:
            return {"success": False, "message": "No thumbnail file provided"}, 400


@challenges_namespace.route("/attempt")
class ChallengeAttempt(Resource):
    @check_challenge_visibility
    @during_ctf_time_only
    @require_verified_emails
    def post(self):
        
        if authed() is False:
            return {"success": True, "data": {"status": "authentication_required"}}, 403

        #if request.content_type != "application/json":
         #   request_data = request.form
        #else:
         
         #   request_data = request.get_json()
        
        return outgoingPost(request)
        
        
        
        
        


@challenges_namespace.route("/<challenge_id>/solves")
class ChallengeSolves(Resource):
    @check_challenge_visibility
    @check_score_visibility
    @during_ctf_time_only
    @require_verified_emails
    def get(self, challenge_id):
        response = []
        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()

        # TODO: Need a generic challenge visibility call.
        # However, it should be stated that a solve on a gated challenge is not considered private.
        if challenge.state == "hidden" and is_admin() is False:
            abort(404)

        freeze = get_config("freeze")
        if freeze:
            preview = request.args.get("preview")
            if (is_admin() is False) or (is_admin() is True and preview):
                freeze = True
            elif is_admin() is True:
                freeze = False

        response = get_solves_for_challenge_id(challenge_id=challenge_id, freeze=freeze)
        
        print(response)
        return {"success": True, "data": response}


@challenges_namespace.route("/<challenge_id>/files")
class ChallengeFiles(Resource):
    @admins_only
    def get(self, challenge_id):
        response = []

        challenge_files = ChallengeFilesModel.query.filter_by(
            challenge_id=challenge_id
        ).all()

        for f in challenge_files:
            response.append({"id": f.id, "type": f.type, "location": f.location})
        return {"success": True, "data": response}


@challenges_namespace.route("/<challenge_id>/tags")
class ChallengeTags(Resource):
    @admins_only
    def get(self, challenge_id):
        response = []

        tags = Tags.query.filter_by(challenge_id=challenge_id).all()

        for t in tags:
            response.append(
                {"id": t.id, "challenge_id": t.challenge_id, "value": t.value}
            )
        return {"success": True, "data": response}


@challenges_namespace.route("/<challenge_id>/topics")
class ChallengeTopics(Resource):
    @admins_only
    def get(self, challenge_id):
        response = []

        topics = ChallengeTopicsModel.query.filter_by(challenge_id=challenge_id).all()

        for t in topics:
            response.append(
                {
                    "id": t.id,
                    "challenge_id": t.challenge_id,
                    "topic_id": t.topic_id,
                    "value": t.topic.value,
                }
            )
        return {"success": True, "data": response}


@challenges_namespace.route("/<challenge_id>/hints")
class ChallengeHints(Resource):
    @admins_only
    def get(self, challenge_id):
        hints = Hints.query.filter_by(challenge_id=challenge_id).all()
        schema = HintSchema(many=True)
        response = schema.dump(hints)

        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}


@challenges_namespace.route("/<challenge_id>/flags")
class ChallengeFlags(Resource):
    @admins_only
    def get(self, challenge_id):
        flags = Flags.query.filter_by(challenge_id=challenge_id).all()
        schema = FlagSchema(many=True)
        response = schema.dump(flags)

        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}


@challenges_namespace.route("/<challenge_id>/requirements")
class ChallengeRequirements(Resource):
    @admins_only
    def get(self, challenge_id):
        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
        return {"success": True, "data": challenge.requirements}



