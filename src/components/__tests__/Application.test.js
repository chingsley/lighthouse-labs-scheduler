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
  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment (the show componet that has interviewer name = 'Archie Cohen').
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appnt) =>
      queryByText(appnt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        'Are you sure you want to delete this appointment?'
      )
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));
    expect(getByAltText(appointment, 'Add')).toBeInTheDocument();

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const daylistItems = getAllByTestId(container, 'day');
    const daylistItemMonday = daylistItems.find((dayListItem) =>
      queryByText(dayListItem, 'Monday')
    );
    // debug(daylistItemMonday);
    expect(
      getByText(daylistItemMonday, '2 spots remaining')
    ).toBeInTheDocument();
  });
});
