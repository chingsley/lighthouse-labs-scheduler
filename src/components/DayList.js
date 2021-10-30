import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  const { days, selectedDay, setSelectedDay } = props;

  return (
    <ul>
      {days &&
        days.map((day) => {
          const selected = day.name === selectedDay;
          return (
            <DayListItem
              key={day.id}
              {...day}
              selected={selected}
              setSelectedDay={setSelectedDay}
            />
          );
        })}
    </ul>
  );
}
