import React from "react";

import deleteIcon from "../../assets/delete.svg";

import "./Note.css";
// import { useReactMediaRecorder } from "react-media-recorder-2";

let timer = 500,
  timeout;
function Note(props) {
  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    // let hrs = date.getUTCHours();
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    // let amPm =  12 < hrs < 24 ? "AM" : "PM";
    hrs = hrs ? hrs : "12";
    // hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;

    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;

    let day = date.getDate();
    let year = date.getUTCFullYear();
    const month = monthNames[date.getMonth()];

    return `${hrs}:${min} ${amPm} (${day}/${month}/${year})`;
  };

  const debounce = (func) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, timer);
  };

  const updateText = (text, id) => {
    debounce(() => props.updateText(text, id));
  };

  // const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ video: false });

  // const recording = { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl };

  return (
    <div className="note" style={{ backgroundColor: props.note.color }}>
      <textarea
        className="note_text"
        defaultValue={props.note.text}
        onChange={(event) => updateText(event.target.value, props.note.id)}
      />
      <textarea
        className="note_text"
        defaultValue={props.output}
        onChange={(event) => updateText(event.target.value, props.note.id)}
      />
      <div className="note_footer">
        <p>{formatDate(props.note.time)}</p>
        <img
          src={deleteIcon}
          alt="DELETE"
          onClick={() => props.deleteNote(props.note.id)}
        />
      </div>
      <div>
        <p>{props.recordVoice.status}</p>
        {props.recordVoice.status == 'idle' && (
          <button onClick={props.recordVoice.startRecording}>Start Recording</button>
        )}
        {props.recordVoice.status == 'recording' && (
          <button onClick={props.recordVoice.stopRecording}>Stop Recording</button>
        )}
        {props.recordVoice.mediaBlobUrl ? <audio hidden src={props.recordVoice.mediaBlobUrl} controls /* autoPlay loop */ /> : <></>}
        {/* <audio src={props.recordVoice.mediaBlobUrl} controls /> */}
        <button onClick={props.recordVoice.clearBlobUrl}>Clear</button>
        <button onClick={() => props.handleSave()}>Transcribe</button>
      </div>
    </div>
  );
}

export default Note;
