import React, { useEffect, useState } from "react";

import NoteContainer from "./Components/NoteContainer/NoteContainer";
import Sidebar from "./Components/Sidebar/Sidebar";

import "./App.css";
// import Progress from "./Components/Progress";
import { useReactMediaRecorder } from "react-media-recorder-2";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes-app")) || []
  );

  const addNote = (color) => {
    const tempNotes = [...notes];

    tempNotes.push({
      id: Date.now() + "" + Math.floor(Math.random() * 78),
      text: "",
      recordText: "",
      time: Date.now(),
      color,
    });
    setNotes(tempNotes);
  };

  const deleteNote = (id) => {
    const tempNotes = [...notes];

    const index = tempNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    tempNotes.splice(index, 1);
    setNotes(tempNotes);
  };

  const updateText = (text, id) => {
    const tempNotes = [...notes];

    const index = tempNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    tempNotes[index].text = text;
    setNotes(tempNotes);
  };

  const updateRecordText = (output, id) => {
    const tempNotes = [...notes];
    const index = tempNotes.findIndex((item) => item.id === id);
    if (index < 0) return;
    tempNotes[index].recordText = output;
    setOutput('');
    setNotes(tempNotes);
  };  

  // record voice
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ audio: true });
  const recordVoice = { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl };

  const [output, setOutput] = useState('');

  useEffect(() => {
    localStorage.setItem("notes-app", JSON.stringify(notes));
  }, [notes]);

  const handleAudio = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });
    const formData = new FormData();

    formData.append('file', audioFile);  // preparing to send to the server

    onSendAudio(formData); // sending to the server
  };

  const onSendAudio = async (formData) => {
    await axios
      .post("http://localhost:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // handle the response
        console.log(response);
        setOutput(response.data);
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  }

  return (
    <>
      <div className="App">
        <Sidebar addNote={addNote} />
        <NoteContainer
          notes={notes}
          deleteNote={deleteNote}
          updateText={updateText}
          updateRecordText={updateRecordText}
          recordVoice={recordVoice}
          output={output}
          handleAudio={handleAudio}
        />
      </div>
    </>
  );
}

export default App;
