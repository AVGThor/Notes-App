from flask import Flask, render_template, request
from flask_cors import CORS
from model.stt import stt

app = Flask(__name__)
CORS(app)


# # @app.route("/", methods=["POST"])
# def handle_post():
#     if request.method == "POST":
#         print("POSTED")


# @app.route("/transcribe")
@app.route("/transcribe")
def get_transcribe():
    # file = request.files["file"]
    return stt("audio_clip_8.wav")["text"]


if __name__ == "__main__":
    app.run(port=5000, debug=True)