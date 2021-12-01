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
  waitForElementToBeRemoved,
  queryByText,
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
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];
    // console.log(prettyDOM(appointment));

    // click the 'Add' button
    fireEvent.click(getByAltText(appointment, 'Add'));

    // enter student name
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    //select interviewer
    fireEvent.click(getAllByTestId(appointment, 'interviewer')[0]);
    // fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // save interviewr
    fireEvent.click(getByText(appointment, 'Save'));
    // await waitForElement(() => debug(appointment));

    // conffirm that the "Saving" modal is displayed
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    /**
     * test that the Show component renders with the student name:
     *
     * Method 1: wait for the element containg student name 'Lydia Miller-Jones' to mount
     * await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
     *
     * Method 2: Wait for the component containing 'Saving' to unmount, then find
     *           the element containing student name 'Lydia Miller-Jones'
     * await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
     * expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();
     *
     * We used Method 2
     */
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    /**
     * get all DaylistItem components (we added data-testid="day" to li in DaylistItem)
     * First argument og getAllByTestId should be 'container' not 'appointment'
     * because the DayList component is rendered in Application.js not in
     * Appointment.js
     */
    const daylistItems = getAllByTestId(container, 'day');

    /**
     * find the DaylistItem that has the text 'Monday'
     * NOTE: We cannot use getBy and queryBy interchangeably in this case.
     * In this situation, we want to use queryByText because we want to
     *  have the value null returned if it doesn't find the node. If we used getBy instead then our test will throw an error and fail if it doesn't find the text "Monday" on the first iteration
     */
    const daylistItemMonday = daylistItems.find((dayListItem) =>
      queryByText(dayListItem, 'Monday')
    );
    expect(
      getByText(daylistItemMonday, 'no spots remaining')
    ).toBeInTheDocument();
    // console.log(prettyDOM(daylistItemMonday));
  });
});
