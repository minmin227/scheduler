import React from 'react';
import "components/InterviewerListItem.scss";
let classNames = require('classnames');

export default function InterviewerlistItem (props) {
  let selectInterviewer = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  } )
  return (
    <li className={selectInterviewer} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src= {props.avatar}
        alt= {props.name}
      /> 
      {props.selected && props.name }
    </li>
  )
}