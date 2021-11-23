import React, { useState } from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Status from './Status';
import Error from './Error';
import Confirm from './Confirm';
import Form from '../Form';

import 'components/Appointment/styles.scss';
import useVisualMode from 'hooks/useVisualMode';
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const ERROR = "ERROR";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";



export default function Appointment(props) {
  const { mode, back, transition } = useVisualMode(props.interview ? SHOW : EMPTY);
  const [error, setError] = useState('');

  const onCancel = () => back();

  const save = (name, interviewer) => {
    if (!name || !interviewer) {
      console.log('Error: You must enter student name and choose an interviewer');
      return;
    }
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(res2 => {
      transition(SHOW);
    }).catch(err => {
      // console.log({ err });
      setError(err.response.data.error || 'something went wrong');
      transition(ERROR, true);
    });
  };

  const handleDelete = () => {
    transition(SAVING);
    props.cancelInterview().then(() => {
      transition(EMPTY);
    }).catch(error => {
      console.log(error);
      // trasition to error;
    });
  };


  const display = (mode) => {
    switch (mode) {
      case EMPTY:
        return <Empty onAdd={() => transition(CREATE)} />;
      case SHOW:
        return <Show
          {...props.interview}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />;
      case CREATE:
        return <Form
          onCancel={onCancel}
          interviewers={props.interviewers}
          onSave={save}
        />;
      case EDIT:
        return <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
        />;
      case SAVING:
        return <Status message='Saving' />;
      case ERROR:
        return <Error message={error} onClose={onCancel} />;
      case CONFIRM:
        return <Confirm
          message={'Are you sure you want to delete this appointment?'}
          onCancel={onCancel}
          onConfirm={handleDelete}
        />;
      default:
        return null;
    }

  };


  return (
    <article className='appointment'>
      <Header time={props.time} />
      {display(mode)}
    </article>
  );
}
