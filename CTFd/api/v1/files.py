from typing import List

from flask import request, current_app
from flask_restx import Namespace, Resource
import os
from CTFd.api.v1.helpers.request import validate_args
from CTFd.api.v1.helpers.schemas import sqlalchemy_to_pydantic
from CTFd.api.v1.schemas import APIDetailedSuccessResponse, APIListSuccessResponse
from CTFd.constants import RawEnum
from CTFd.models import Files, db
from CTFd.schemas.files import FileSchema
from CTFd.utils import uploads
from CTFd.utils.decorators import admins_only
from CTFd.utils.helpers.models import build_model_filters
from moviepy.editor import *

files_namespace = Namespace("files", description="Endpoint to retrieve Files")

FileModel = sqlalchemy_to_pydantic(Files)


class FileDetailedSuccessResponse(APIDetailedSuccessResponse):
    data: FileModel


class FileListSuccessResponse(APIListSuccessResponse):
    data: List[FileModel]


files_namespace.schema_model(
    "FileDetailedSuccessResponse", FileDetailedSuccessResponse.apidoc()
)

files_namespace.schema_model(
    "FileListSuccessResponse", FileListSuccessResponse.apidoc()
)


@files_namespace.route("")
class FilesList(Resource):
    @admins_only
    @files_namespace.doc(
        description="Endpoint to get file objects in bulk",
        responses={
            200: ("Success", "FileListSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    @validate_args(
        {
            "type": (str, None),
            "location": (str, None),
            "q": (str, None),
            "field": (
                RawEnum("FileFields", {"type": "type", "location": "location"}),
                None,
            ),
        },
        location="query",
    )
    def get(self, query_args):
        q = query_args.pop("q", None)
        field = str(query_args.pop("field", None))
        filters = build_model_filters(model=Files, query=q, field=field)

        files = Files.query.filter_by(**query_args).filter(*filters).all()
        schema = FileSchema(many=True)
        response = schema.dump(files)

        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}

    @admins_only
    @files_namespace.doc(
        description="Endpoint to get file objects in bulk",
        responses={
            200: ("Success", "FileDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def post(self):
        count = 0
        for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
            count +=1
        print(count)
        files = request.files.getlist("file")
        print(files)
        # challenge_id
        # page_id

        # Handle situation where users attempt to upload multiple files with a single location
        print(request.form.get("location"));
        if len(files) > 1 and request.form.get("location"):
            return {
                "success": False,
                "errors": {
                    "location": ["Location cannot be specified with multiple files"]
                },
            }, 400

        objs = []
        #on genere un fichier de plus qui seras remplacer par la thumbsnail
        files += files[0],


        for f in files:
            try:
                obj = uploads.upload_file(file=f, **request.form.to_dict())
            except ValueError as e:
                return {
                    "success": False,
                    "errors": {"location": [str(e)]},
                }, 400
            objs.append(obj)

        schema = FileSchema(many=True)
        response = schema.dump(objs)
        print("UPLOAD_FOLDER")
        count = 0
        for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
            count +=1
        print(count)

        for i in range(len(files)):
            response.data[i]["type"] = str(files[i]).split('\'')[3]
            print(response.data[i]["location"])
            #opperation a effectuer seulement sur la thumbsnail:
            if i == 0:
                if response.data[i]["type"].find("video") != -1:
                    clip = VideoFileClip(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"])
                    count = 0
                    for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
                        count +=1
                    print(count)
                    os.remove(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"])
                    clip.save_frame(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"].split('.')[0]+".jpg", t = 1)
                    count = 0
                    for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
                        count +=1
                    print(count)
                    response.data[i]["type"] = "thumbsnail"
            else:
                if response.data[i]["type"].find("video") != -1:
                    clip = VideoFileClip(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"])
                    count = 0
                    for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
                        count +=1
                    print(count)
                    os.remove(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"])
                    clip_resized = clip.resize((800,450))
                    clip_resized.write_videofile(current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"].split('.')[0]+".mp4")
                    count = 0
                    for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
                        count +=1
                    print(count)
                    
                    response.data[i]["type"] = "video/mp4"
            
        count = 0
        for x in os.walk(current_app.config.get("UPLOAD_FOLDER")):
            count +=1
        print(count)
        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}


@files_namespace.route("/<file_id>")
class FilesDetail(Resource):
    @admins_only
    @files_namespace.doc(
        description="Endpoint to get a specific file object",
        responses={
            200: ("Success", "FileDetailedSuccessResponse"),
            400: (
                "An error occured processing the provided or stored data",
                "APISimpleErrorResponse",
            ),
        },
    )
    def get(self, file_id):
        f = Files.query.filter_by(id=file_id).first_or_404()
        schema = FileSchema()
        response = schema.dump(f)

        if response.errors:
            return {"success": False, "errors": response.errors}, 400

        return {"success": True, "data": response.data}

    @admins_only
    @files_namespace.doc(
        description="Endpoint to delete a file object",
        responses={200: ("Success", "APISimpleSuccessResponse")},
    )
    def delete(self, file_id):
        f = Files.query.filter_by(id=file_id).first_or_404()

        uploads.delete_file(file_id=f.id)
        db.session.delete(f)
        db.session.commit()
        db.session.close()

        return {"success": True}
