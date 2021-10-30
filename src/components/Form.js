import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

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
              setStudent(event.target.value);
            }}
          />
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
