from typing import List

from flask import current_app, make_response, request
from flask_restx import Namespace, Resource

from CTFd.api.v1.helpers.request import validate_args
from CTFd.api.v1.helpers.schemas import sqlalchemy_to_pydantic
from CTFd.api.v1.schemas import APIDetailedSuccessResponse, APIListSuccessResponse
from CTFd.constants import RawEnum
from CTFd.models import Medias, db
from CTFd.schemas.medias import MediaSchema
from CTFd.utils.decorators import admins_only
from CTFd.utils.helpers.models import build_model_filters


medias_namespace = Namespace(
    "medias", description="Endpoint to retrieve medias"
)
MediaModel = sqlalchemy_to_pydantic(Medias)
TransientMediaModel = sqlalchemy_to_pydantic(Medias, exclude=["id"])

class MediaDetailedSuccessResponse(APIDetailedSuccessResponse):
    data: MediaModel


class MediaListSuccessResponse(APIListSuccessResponse):
    data: List[MediaModel]

medias_namespace.schema_model(
    "MediaDetailedSuccessResponse", MediaDetailedSuccessResponse.apidoc()
)

medias_namespace.schema_model(
    "MediaListSuccessResponse", MediaListSuccessResponse.apidoc()
)
@medias_namespace.route("")
class MediaList(Resource):
    @medias_namespace.doc(
        description="Endpoint to get media objects in bulk",
        responses={
            200: ("Success", "mediaListSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    @validate_args(
        {
            "thumbsnail": (str, None),
            "content": (str, None),
            "user_id": (int, None),
            "team_id": (int, None),
            "challenge_id": (int, None),
            "q": (str, None),
            "field": (
                RawEnum("mediaFields", {"thumbsnail": "thumbsnail", "content": "content"}),
                None,
            ),
        },
        location="query",
    )
    def get(self, query_args):
        
        q = query_args.pop("q", None)
        field = str(query_args.pop("field", None))
        filters = build_model_filters(model=Medias, query=q, field=field)

        medias = (
            Medias.query.filter_by(**query_args).filter(*filters).all()
        )
        schema = MediaSchema(many=True)
        result = schema.dump(medias)
        if result.errors:
            return {"success": False, "errors": result.errors}, 400
        return {"success": True, "data": result.data}

    @medias_namespace.doc(
        description="Endpoint to get statistics for media objects in bulk",
        responses={200: ("Success", "APISimpleSuccessResponse")},
    )
    @validate_args(
        {
            "thumbsnail": (str, None),
            "content": (str, None),
            "user_id": (int, None),
            "team_id": (int, None),
            "challenge_id": (int, None),
            "q": (str, None),
            "field": (
                RawEnum("mediaFields", {"thumbsnail": "thumbsnail", "content": "content"}),
                None,
            ),
        },
        location="query",
    )
    def head(self, query_args):
        q = query_args.pop("q", None)
        field = str(query_args.pop("field", None))
        filters = build_model_filters(model=Medias, query=q, field=field)

        media_count = (
            Medias.query.filter_by(**query_args).filter(*filters).count()
        )
        response = make_response()
        response.headers["Result-Count"] = media_count
        return response

    @admins_only
    @medias_namespace.doc(
        description="Endpoint to create a media object",
        responses={
            200: ("Success", "mediaDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def post(self):
        req = request.get_json()
        
        schema = MediaSchema()
        result = schema.load(req)

        if result.errors:
            return {"success": False, "errors": result.errors}, 400

        db.session.add(result.data)
        db.session.commit()

        response = schema.dump(result.data)

        current_app.events_manager.publish(data=response.data, type="media")

        return {"success": True, "data": response.data}

@medias_namespace.route("/<media_id>")
@medias_namespace.param("media_id", "A media ID")
class media(Resource):
    @medias_namespace.doc(
        description="Endpoint to get a specific media object",
        responses={
            200: ("Success", "mediaDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def get(self, media_id):
        med = medias.query.filter_by(id=media_id).first_or_404()
        schema = MediaSchema()
        response = schema.dump(med)
        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}

    @admins_only
    @medias_namespace.doc(
        description="Endpoint to delete a media object",
        responses={200: ("Success", "APISimpleSuccessResponse")},
    )
    def delete(self, media_id):
        med = medias.query.filter_by(id=media_id).first_or_404()
        db.session.delete(med)
        db.session.commit()
        db.session.close()

        return {"success": True}
