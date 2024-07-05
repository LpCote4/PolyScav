from typing import List

from flask import request, current_app
from flask_restx import Namespace, Resource
import os
from CTFd.api.v1.helpers.request import validate_args
from CTFd.api.v1.helpers.schemas import sqlalchemy_to_pydantic
from CTFd.api.v1.schemas import APIDetailedSuccessResponse, APIListSuccessResponse
from CTFd.constants import RawEnum
from CTFd.models import Files, db, Submissions
from CTFd.schemas.files import FileSchema
from CTFd.utils import uploads
from CTFd.utils.decorators import admins_only
from CTFd.utils.helpers.models import build_model_filters
from moviepy.editor import *
from PIL import Image, ExifTags
import subprocess
import shlex
import json
from CTFd.api.v1 import challenges
from CTFd.api.v1 import submissions


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

class FakeRequest(object):
    content = {"none":0}
    args = {}
    access_route = ""
    remote_addr = ""
    def get_json(self):
        return self.content
    def get(self, name):
        try:
            return self.content[name]
        except:
            return None
    def setJson(self, dictJ):
        self.content = dictJ

    def setArgs(self, dictA):
        self.args = dictA

    def __getitem__(self, item):
         return self.content[item]
         
# def correct_image_orientation(file_path_with_file_name):
#     try:
#         image = Image.open(file_path_with_file_name)
#         for orientation in ExifTags.TAGS.keys():
#             if ExifTags.TAGS[orientation] == 'Orientation':
#                 break
       
#         exif = image._getexif()
#         if exif is not None:
#             orientation = exif.get(orientation)
#             if orientation == 3:
#                 image = image.rotate(180, expand=True)
#             elif orientation == 6:
#                 image = image.rotate(270, expand=True)
#             elif orientation == 8:
#                 image = image.rotate(90, expand=True)
#         image.save(file_path_with_file_name)
#         image.close()
#     except (AttributeError, KeyError, IndexError):
#         # Cases: image don't have getexif
#         pass

@files_namespace.route("")
class FilesList(Resource):
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
    @admins_only
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
        submission_id = -1
        heavyData = False
        maxContentLength = 201000000
        # challenge_id
        # page_id
        #max 200000000 + 1 Mb pour le reste des info de la request
        if int(request.headers.get('Content-Length')) > maxContentLength and int(request.headers.get('Content-Length')) < maxContentLength:
            heavyData = True
        elif int(request.headers.get('Content-Length')) > maxContentLength:
            return {
                "success": False,
                "errors": {
                    "location": ["File can't be bigger than 200 MB, even with compression. Please use external tools and share it with a link"]
                },
            }, 400

    
        files = request.files.getlist("file")
        
        # Handle situation where users attempt to upload multiple files with a single location
        if len(files) > 1 and request.form.get("location"):
            return {
                "success": False,
                "errors": {
                    "location": ["Location cannot be specified with multiple files"]
                },
            }, 400

        #we are creating the submissions to make sure nobody can take it if sending a smaller file
        item = FakeRequest()
        if not request.args.get("admin", False):
            item.setJson({"challenge_id": request.form.get("id"), "submission":"Media en train d'être traité", "type":"None"})
            item.access_route = request.access_route
            item.remote_addr = request.remote_addr
            submission_id = challenges.outgoingPost(item)["data"]["submission_id"]
            

        objs = []
        #on genere un fichier de plus qui seras remplacer par la thumbsnail
        files += files[0],
        vraietype = []
        first = True
        for f in files:
            vraietype += str(f).split('.')[1].split("\'")[0],
            try:
                dico = request.form.to_dict()
                try:
                    del dico["type"]
                    del dico["id"]
                except:
                    pass
                
                dico["first"] = first
                obj = uploads.upload_file(file=f, **dico)
                first = False
                
            except ValueError as e:
                return {
                    "success": False,
                    "errors": {"location": [str(e)]},
                }, 400
            objs.append(obj)
        
        schema = FileSchema(many=True)
        response = schema.dump(objs)
        
        width = 800
        fps = 24
        if (heavyData):
            width = 500
            fps = 15
        size = 0
        for i in range(len(files)):
            response.data[i]["location"] = response.data[i]["location"].split('.')[0] + "." +vraietype[i].lower()
            path = current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"]
            try:
                size += os.path.getsize(path)
            except:
                #il tente de parcourire les fichier temporaire
                size += 0
        
        for i in range(len(files)):
            response.data[i]["location"] = response.data[i]["location"].split('.')[0] + "." +vraietype[i].lower()
            response.data[i]["type"] = str(files[i]).split('\'')[3]
            path = current_app.config.get("UPLOAD_FOLDER")+"/"+response.data[i]["location"]
            directory = ""
            for x in path.split('/')[0:-1]:
                directory += "/"+x
           
            #opperation a effectuer seulement sur la thumbsnail:
            if i == 0:
                if response.data[i]["type"].find("video") != -1:
                    clip = VideoFileClip(path)
                    
                    os.remove(path)
                    path = path.split('.')[0]+".png"
                    clip.save_frame(path, t = 1)
                    
                    response.data[i]["type"] = "image/png"
                #we also want to reduce the size of videos thumbsnail
                if response.data[i]["type"].find("image") != -1:
                    image = Image.open(path)
                    os.remove(path)
                    #same as image.resize but keeping the ratio ;-)
                    if not request.args.get("admin", False):
                        image.thumbnail((50, 50))
                    image.save(path.split('.')[0]+".png")
                    response.data[i]["type"] = "thumbsnail"
                    response.data[i]["location"] = response.data[i]["location"].split('.')[0]+".png"

            #operation pour image/video normale
            else:
                if response.data[i]["type"].find("video") != -1:
                    clip = VideoFileClip(path)
                    
                    os.remove(path)
                    
                    if clip.rotation == 90:
                        clip = clip.resize(clip.size[::-1])
                        clip.rotation = 0
                    
                    clip_resized = clip.resize((width*(clip.size[0]/clip.size[1]), 
                    width))
                    
                    clip_resized = clip_resized.set_fps(fps) 
                    clip_resized.write_videofile(path.split('.')[0]+".webm", codec="libvpx")
                    
                    
                    response.data[i]["type"] = "video/webm"
                    response.data[i]["location"] = response.data[i]["location"].split('.')[0]+".webm"
                
                elif response.data[i]["type"].find("image") != -1:
                    
                    image = Image.open(path)
                    os.remove(path)
                    try:
                        for orientation in ExifTags.TAGS.keys():
                            if ExifTags.TAGS[orientation] == 'Orientation':
                                break
                    
                        exif = image._getexif()
                    
                        if exif is not None:
                        orientation = exif.get(orientation)
                        if orientation == 3:
                            image = image.rotate(180, expand=True)
                        elif orientation == 6:
                            image = image.rotate(270, expand=True)
                        elif orientation == 8:
                            image = image.rotate(90, expand=True)
                    except:
                        pass         

                    #same as image.resize but keeping the ratio ;-)
                    if not request.args.get("admin", False):
                        image.thumbnail((width,width*(image.size[1]/image.size[0])))
                    image.save(path.split('.')[0]+".png")
                    response.data[i]["type"] = "image/png"
                    response.data[i]["location"] = response.data[i]["location"].split('.')[0]+".png"
            
        
        if response.errors:
            
            return {"success": False, "errors": response.errors}, 400

        if not request.args.get("admin", False):

            submission = Submissions.query.filter_by(id=submission_id).first_or_404()
            
            submission.provided = json.dumps(response.data)
            
            db.session.commit()
            
            
        return {"success": True, "data": response.data}
    
    def get_rotation(self, file_path_with_file_name):
        """
        Function to get the rotation of the input video file.
        Adapted from gist.github.com/oldo/dc7ee7f28851922cca09/revisions using the ffprobe comamand by Lord Neckbeard from
        stackoverflow.com/questions/5287603/how-to-extract-orientation-information-from-videos?noredirect=1&lq=1

        Returns a rotation None, 90, 180 or 270
        """
        cmd = "ffmpeg -loglevel error -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1"
        args = shlex.split(cmd)
        args.append(file_path_with_file_name)
        # run the ffprobe process, decode stdout into utf-8 & convert to JSON
        ffprobe_output = subprocess.check_output(args).decode('utf-8')
        if len(ffprobe_output) > 0:  # Output of cmdis None if it should be 0
            ffprobe_output = json.loads(ffprobe_output)
            rotation = ffprobe_output

        else:
            rotation = 0

        return rotation

@files_namespace.route("/<file_id>")
class FilesDetail(Resource):

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
