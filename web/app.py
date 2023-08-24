import os
import random
from flask import Flask, request, redirect
# import speech_recognition as sr
from model.stt import stt
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

        file_name = "random.wav"
        file.save(file_name)

        transcript = stt("random.wav")["text"]

        os.remove("random.wav")

    # return render_template('index.html', transcript=transcript)
    return transcript

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
