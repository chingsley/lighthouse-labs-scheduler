import React from 'react';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getAllByTestId,
  getByText,
  getByAltText,
  getByPlaceholderText,
  getByTestId,
} from '@testing-library/react';
import Application from 'components/Application';

afterEach(cleanup);

describe('<Application />', () => {
  it('defaults to Monday and changes the schedule when a new day is selected (Promise)', () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'));
      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
  });
  it('changes the schedule when a new day is selected (Async/Await)', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment')[0];

    // click the 'Add' button
    fireEvent.click(getByAltText(appointment, 'Add'));

    // enter student name
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' },
    });

    //select interviewer
    fireEvent.click(getAllByTestId(appointment, 'interviewer')[0]);

    // save interviewr
    // fireEvent.click(getByText(appointment, 'Save'));

    // console.log(prettyDOM(appointment));
  });
});
