import React from "react";
import "components/DayListItem.js";
import DayListItem from "components/DayListItem.js";

export default function DayList(props) {
  console.log(props);
  const dayList = props.days.map(day => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name} 
        spots={day.spots} 
        selected={day.name === props.value}
        setDay={(event=>props.onChange(day.name))}
      />);
  });
  
  return (
    <ul>{dayList} </ul>
  );
}

//setDay={props.setDay}
