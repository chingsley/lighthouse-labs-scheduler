import React from 'react';

import { render, cleanup } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

import Form from 'components/Form';
import { STUDENT_NAME_REQUIRED } from 'constants/messages';

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  xit('skips this text because of "xit"', () => {
    render(<Form />);
  });
  it('renders without student name if not provided', () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText('Enter Student Name')).toHaveValue('');
  });

  it('renders with initial student name', () => {
    const student = 'Lydia Miller-Jones';
    const { getByTestId } = render(
      <Form interviewers={interviewers} student={student} />
    );
    expect(getByTestId('student-name-input')).toHaveValue(student);
  });
  it('validates that the student name is not blank', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
    fireEvent.click(getByText('Save'));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    // expect(
    //   getByText(new RegExp(STUDENT_NAME_REQUIRED, 'i'))
    // ).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onSave function when the name is defined', () => {
    const onSave = jest.fn();
    const interview = {
      student: 'Lydia Miller-Jones',
      interviewer: 2,
    };
    const { queryByText, getByText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        student={interview.student}
        interviewer={interview.interviewer}
      />
    );
    fireEvent.click(getByText('Save'));
    expect(queryByText(new RegExp(STUDENT_NAME_REQUIRED, 'i'))).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);

    /* onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledWith(
      interview.student,
      interview.interviewer
    );
  });
});
