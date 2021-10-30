import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  const { name, avatar, setInterviewer, selected } = props;

  const InterviewerListItemClass = classNames('interviewers__item', {
    'interviewers__item--selected': selected,
  });
  return (
    <li className={InterviewerListItemClass} onClick={setInterviewer}>
      <img
        className='interviewers__item-image'
        src={avatar}
        alt='Sylvia Palmer'
      />
      {selected && name}
    </li>
  );
}
