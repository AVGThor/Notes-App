import os
import random
from flask import Flask, request, redirect
# import speech_recognition as sr
from model.model_train import model_train
from flask_cors import CORS, cross_origin   

app = Flask(__name__)
cors = CORS(app)

@app.route("/", methods=["GET", "POST"])
def index():
    transcript = ""
    if request.method == "POST":
        print("FORM DATA RECEIVED")

        if "file" not in request.files:
            return redirect(request.url)

        file = request.files["file"]

        if file.filename == "":
            return redirect(request.url)

        file_name = "voice.wav"
        file.save(file_name)

        transcript = model_train("voice.wav")["text"]

        os.remove("voice.wav")
    return transcript

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
