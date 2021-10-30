import React from 'react';
import InterviewerListItem from './InterviewerListItem';

import 'components/InterviewerList.scss';

export default function InterviewerList(props) {
  const { selectedInterviewerId, interviewers, setSelectedInterviewerId } =
    props;

  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>
        {interviewers.map((interviewer) => {
          const selected = interviewer.id === selectedInterviewerId;
          return (
            <InterviewerListItem
              key={interviewer.id}
              {...interviewer}
              selected={selected}
              setInterviewer={() => setSelectedInterviewerId(interviewer.id)}
            />
          );
        })}
      </ul>
    </section>
  );
}
