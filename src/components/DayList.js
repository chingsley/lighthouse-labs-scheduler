import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  return (
    <ul>
      {props.days &&
        props.days.map((day) => {
          const selected = day.name === props.day;
          return (
            <DayListItem
              key={day.id}
              {...day}
              selected={selected}
              setDay={props.setDay}
            />
          );
        })}
    </ul>
  );
}
