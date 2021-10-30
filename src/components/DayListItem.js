import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const { name, spots, selected, setSelectedDay } = props;

  const formatSpots = (spots) => {
    switch (spots) {
      case 0:
        return 'no spots';
      case 1:
        return '1 spot';
      default:
        return `${spots} spots`;
    }
  };
  const dayListItemClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots < 1,
  });

  return (
    <li className={dayListItemClass} onClick={() => setSelectedDay(name)}>
      <h2 className='text--regular'>{name}</h2>
      <h3 className='text--light'>{formatSpots(spots)} remaining</h3>
    </li>
  );
}
