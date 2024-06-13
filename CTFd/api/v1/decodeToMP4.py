import json
import ffmpeg
import cv2
import tempfile
import base64
pip install MoviePy

def decodeToMP4(title, binary):
    output = ""
    if (title == "video/quicktime"):
        title = "video/mov"
    
    extension = title.split("/")[1]
    print(extension)
    
    temp_path = tempfile.gettempdir()
    video_binary_string = binary
    decoded_string = base64.b64decode(video_binary_string)

    with open(str(temp_path)+str('/video.')+str(extension), 'wb') as wfile:
        wfile.write(decoded_string)
    cap = cv2.VideoCapture(temp_path+'/video.'+str(extension))
    success, frame = cap.read()

    clip = moviepy.VideoFileClip(str(temp_path)+str('/video.')+str(extension))
    clip.write_videofile(str(temp_path)+str('/video.')+"mp4")
    
    with open(str(temp_path)+str('/video.')+str(extension), "rb") as videoFile:
        output = base64.b64encode(videoFile.read())
    
    print(output)
    return output 
    output = binary
    if (title != "video/quicktime"):
        
        
        extension = title.split("/")[1]
        print(extension)
        
        temp_path = tempfile.gettempdir()
        video_binary_string = binary
        decoded_string = base64.b64decode(video_binary_string)

        with open(str(temp_path)+str('/video.')+str(extension), 'wb') as wfile:
            wfile.write(decoded_string)
        cap = cv2.VideoCapture(temp_path+'/video.'+str(extension))
        print(cap)
        success, frame = cap.read()

        print(success)
        print(frame)
        
        with open(str(temp_path)+str('/video.')+extension, "rb") as videoFile:
            
            output = base64.b64encode(videoFile.read())
        
        
    return json.dumps([{"video/mp4":output.decode('unicode_escape')}]) 