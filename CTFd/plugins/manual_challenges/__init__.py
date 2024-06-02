from flask import Blueprint

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


class ManualChallenge(Challenges):
    __mapper_args__ = {"polymorphic_identity": "manual"}
    id = db.Column(
        db.Integer, db.ForeignKey("challenges.id", ondelete="CASCADE"), primary_key=True
    )

    def __init__(self, *args, **kwargs):
        super(ManualChallenge, self).__init__(**kwargs)
        


class ManualValueChallenge(BaseChallenge):
    id = "manual"  # Unique identifier used to register challenges
    name = "manual"  # Name of a challenge type

    templates = (
        {  # Handlebars templates used for each aspect of challenge editing & viewing
            "create": "/plugins/manual_challenges/assets/create.html",
            "update": "/plugins/manual_challenges/assets/update.html",
            "view": "/plugins/manual_challenges/assets/view.html",
        }
    )
    scripts = {  # Scripts that are loaded when a template is loaded
        "create": "/plugins/manual_challenges/assets/create.js",
        "update": "/plugins/manual_challenges/assets/update.js",
        "view": "/plugins/manual_challenges/assets/view.js",
    }
    # Route at which files are accessible. This must be registered using register_plugin_assets_directory()
    route = "/plugins/manual_challenges/assets/"
    # Blueprint used to access the static_folder directory.
    blueprint = Blueprint(
        "manual_challenges",
        __name__,
        template_folder="templates",
        static_folder="assets",
    )
    challenge_model = ManualChallenge

    @classmethod
    def read(cls, challenge):
        """
        This method is in used to access the data of a challenge in a format processable by the front end.

        :param challenge:
        :return: Challenge object, data dictionary to be returned to the user
        """
        challenge = ManualChallenge.query.filter_by(id=challenge.id).first()
        data = {
            "id": challenge.id,
            "name": challenge.name,
            "value": challenge.value,
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
    upgrade(plugin_name="manual_challenges")
    CHALLENGE_CLASSES["manual"] = ManualValueChallenge
    register_plugin_assets_directory(
        app, base_path="/plugins/manual_challenges/assets/"
    )
