import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';
import {
  INTERVIEWER_NOT_SELECTED,
  STUDENT_NAME_REQUIRED,
} from 'constants/messages';

export default function Form(props) {
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [inputError, setInputError] = useState(null);

  function reset() {
    setStudent('');
    setInterviewer(null);
  }

  function cancel() {
    reset();
    props.onCancel();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!student) {
      setInputError(STUDENT_NAME_REQUIRED);
      return;
    }
    if (!interviewer) {
      setInputError(INTERVIEWER_NOT_SELECTED);
      return;
    }

    props.onSave(student, interviewer);
  }

  return (
    <main className='appointment__card appointment__card--create'>
      <section className='appointment__card-left'>
        <form autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <input
            className='appointment__create-input text--semi-bold'
            name='name'
            type='text'
            placeholder='Enter Student Name'
            value={student}
            onChange={(event) => {
              setInputError(null);
              setStudent(event.target.value);
            }}
            data-testid='student-name-input'
          />
          <p className='appointment__validation'>{inputError}</p>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          selectedInterviewerId={interviewer}
          setSelectedInterviewerId={setInterviewer}
        />
      </section>
      <section className='appointment__card-right'>
        <section className='appointment__actions'>
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={(e) => handleSubmit(e)}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
