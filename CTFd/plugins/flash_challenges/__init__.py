from flask import Blueprint
import datetime
from CTFd.models import (
    ChallengeFiles,
    Challenges,
    Fails,
    Flags,
    Hints,
    Solves,
    Tags,
    db,
)
from CTFd.plugins import register_plugin_assets_directory
from CTFd.plugins.flags import FlagException, get_flag_class
from CTFd.plugins.challenges import CHALLENGE_CLASSES, BaseChallenge
from CTFd.utils.uploads import delete_file
from CTFd.utils.user import get_ip
from CTFd.plugins.migrations import upgrade


class FlashChallenge(Challenges):
    __mapper_args__ = {"polymorphic_identity": "flash"}
    id = db.Column(
        db.Integer, db.ForeignKey("challenges.id", ondelete="CASCADE"), primary_key=True
    )
    startTime = db.Column(db.Integer, default=datetime.datetime.utcnow)
    endTime = db.Column(db.Integer, default=datetime.datetime.utcnow)

    def __init__(self, *args, **kwargs):
        super(FlashChallenge, self).__init__(**kwargs)
        


class FlashValueChallenge(BaseChallenge):
    id = "flash"  # Unique identifier used to register challenges
    name = "flash"  # Name of a challenge type

    templates = (
        {  # Handlebars templates used for each aspect of challenge editing & viewing
            "create": "/plugins/flash_challenges/assets/create.html",
            "update": "/plugins/flash_challenges/assets/update.html",
            "view": "/plugins/flash_challenges/assets/view.html",
        }
    )
    scripts = {  # Scripts that are loaded when a template is loaded
        "create": "/plugins/flash_challenges/assets/create.js",
        "update": "/plugins/flash_challenges/assets/update.js",
        "view": "/plugins/flash_challenges/assets/view.js",
    }
    # Route at which files are accessible. This must be registered using register_plugin_assets_directory()
    route = "/plugins/flash_challenges/assets/"
    # Blueprint used to access the static_folder directory.
    blueprint = Blueprint(
        "flash_challenges",
        __name__,
        template_folder="templates",
        static_folder="assets",
    )
    challenge_model = FlashChallenge

    @classmethod
    def read(cls, challenge):
        """
        This method is in used to access the data of a challenge in a format processable by the front end.

        :param challenge:
        :return: Challenge object, data dictionary to be returned to the user
        """
        challenge = FlashChallenge.query.filter_by(id=challenge.id).first()
        data = {
            "id": challenge.id,
            "name": challenge.name,
            "value": challenge.value,
            "startTime" : challenge.startTime,
            "endTime" : challenge.endTime,
            "description": challenge.description,
            "connection_info": challenge.connection_info,
            "next_id": challenge.next_id,
            "category": challenge.category,
            "state": challenge.state,
            "max_attempts": challenge.max_attempts,
            "type": challenge.type,
            "type_data": {
                "id": cls.id,
                "name": cls.name,
                "templates": cls.templates,
                "scripts": cls.scripts,
            },
        }
        
        return data

    @classmethod
    def update(cls, challenge, request):
        """
        This method is used to update the information associated with a challenge. This should be kept strictly to the
        Challenges table and any child tables.

        :param challenge:
        :param request:
        :return:
        """
        data = request.form or request.get_json()
        for attr, value in data.items():
            setattr(challenge, attr, value)

        db.session.commit()
        return challenge

    @classmethod
    def solve(cls, user, team, challenge, request):
        super().solve(user, team, challenge, request)

        


def load(app):
    upgrade(plugin_name="flash_challenges")
    CHALLENGE_CLASSES["flash"] = FlashValueChallenge
    register_plugin_assets_directory(
        app, base_path="/plugins/flash_challenges/assets/"
    )
