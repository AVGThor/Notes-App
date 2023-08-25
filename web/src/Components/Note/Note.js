import React from "react";

import deleteIcon from "../../assets/delete.svg";
import start from "../../assets/start.svg";
import stop from "../../assets/stop.svg";
import clear from "../../assets/refresh.svg";
import transcribe from "../../assets/transcribe.svg";
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

  const handleSave = (text, id) => {
    props.handleSave();
    props.updateRecordText(text, id);
  }

  return (
    <div className="note" style={{ backgroundColor: props.note.color }}>
      <textarea
        className="note_text"
        defaultValue={props.note.text}
        onChange={(event) => updateText(event.target.value, props.note.id)}
      />
      <textarea
        className="note_text"
        defaultValue={props.note.recordText}
      />
      <div className="note_footer">
        <p>{formatDate(props.note.time)}</p>
        <img
          src={deleteIcon}
          alt="DELETE"
          onClick={() => props.deleteNote(props.note.id)}
        />
      </div>
      <div className="note_footer1">
        {/* <p hidden>{props.recordVoice.status}</p> */}
        {props.recordVoice.status === 'idle' && (
          <img style={{ marginRight: '10px' }} onClick={props.recordVoice.startRecording} src={start} alt="start_recording" />
        )}
        {props.recordVoice.status === 'recording' && (
          <img style={{ marginRight: '10px' }} onClick={props.recordVoice.stopRecording} src={stop} alt="stop_recording" />
        )}
        {props.recordVoice.mediaBlobUrl ? <audio hidden src={props.recordVoice.mediaBlobUrl} controls /* autoPlay loop */ /> : <></>}
        {props.recordVoice.status === 'stopped' && (
          <img style={{ marginRight: '10px' }} onClick={props.recordVoice.clearBlobUrl} src={clear} alt="clear" />)}
        <img onClick={() => handleSave(props.output, props.note.id)} src={transcribe} alt="transcribe" />
      </div>
    </div>
  );
}

export default Note;
