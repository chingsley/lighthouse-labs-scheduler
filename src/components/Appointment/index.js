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
  const { time, interview, interviewers } = props;
  const { mode, back, transition } = useVisualMode(interview ? SHOW : EMPTY);

  const onCancel = () => {
    back();
  };

  function save(name, interviewer) {
    console.log('save() called');
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview).then(res2 => {
      console.log({ res2 });
      transition(SHOW);
    }).catch(err2 => {
      console.log({ err2 });
    });
  }

  const display = (mode) => {
    // console.log({ mode });
    switch (mode) {
      case EMPTY:
        return <Empty onAdd={() => transition(CREATE)} />;
      case SHOW:
        return <Show {...interview} />;
      case CREATE:
        return <Form
          interviewers={[]}
          onCancel={onCancel}
          interviewers={interviewers}
          onSave={save}
        />;
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
