import React from 'react';
import "components/DayListItem.scss";
let classNames = require('classnames');

export default function DayListItem (props) {
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  } )

  let formatSpots = (props) => {
    let result = '';
    {(props.spots === 0) ? result += 'no spots remaining' : (props.spots === 1) ? result += '1 spot remaining' : (result += `${props.spots} spots remaining`) }
    return result;
  }
  
    return (
      <li className = {dayClass} onClick = {() => props.setDay(props.name)}>
        <h2 className = "text--regular">{props.name}</h2>
        <h3 className = "text--light">{formatSpots(props)}</h3>
      </li>
    )

}