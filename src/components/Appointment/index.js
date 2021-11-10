import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from '../Form';

import 'components/Appointment/styles.scss';
import useVisualMode from 'hooks/useVisualMode';
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";



export default function Appointment(props) {
  const { time, interview } = props;
  const { mode, back, transition } = useVisualMode(interview ? SHOW : EMPTY);

  const onCancel = () => {
    back();
  };

  const display = (mode) => {
    console.log({ mode });
    switch (mode) {
      case EMPTY:
        return <Empty onAdd={() => transition(CREATE)} />;
      case SHOW:
        return <Show {...interview} />;
      case CREATE:
        return <Form interviewers={[]} onCancel={onCancel} />;
      default:
        return null;
    }

  };


  return (
    <article className='appointment'>
      <Header time={time} />
      {display(mode)}
    </article>
  );
}
