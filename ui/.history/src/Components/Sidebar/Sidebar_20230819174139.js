import React, { useState } from "react";

import plusIcon from "../../assets/plus.png";

import "./Sidebar.css";

function Sidebar(props) {
  const colors = ["#dc143c", "#fe9b72", "#fec971", " #00d4fe", "#b693fd", "#e4ee91", "#d3ccff", "#cce6ff"];

  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="sidebar">
      <img src={plusIcon} alt="Add" onClick={() => setListOpen(!listOpen)} />
      <ul className={`sidebar_list ${listOpen ? "sidebar_list_active" : ""}`}>
        {colors.map((item, index) => (
          <li
            key={index}
            className="sidebar_list_item"
            style={{ backgroundColor: item }}
            onClick={() => props.addNote(item)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
