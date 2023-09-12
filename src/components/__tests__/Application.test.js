import React from 'react';
import axios from 'axios';

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

    // 3. Click the "Delete" button on the booked appointment (the show componet that has student name = 'Archie Cohen').
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
  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 0. Define Test variables
    const oldStudentName = 'Archie Cohen';
    const newStudentName = 'John Lock';
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, oldStudentName));

    // 3. Click the "Edit" button on the booked appointment.
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appntmt) =>
      queryByText(appntmt, oldStudentName)
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));
    // 4. Change the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: newStudentName }, // set new student name to 'John Brown'
    });

    // 5. Click the "Save" button to save the changes.
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 7. Wait until the 'Saving' status leaves the DOM, then check if new student name ('John Lock') is displayed
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
    expect(getByText(appointment, newStudentName)).toBeInTheDocument();

    // 8. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const daylistItems = getAllByTestId(container, 'day');
    const daylistItemMonday = daylistItems.find((dayListItem) =>
      queryByText(dayListItem, 'Monday')
    );
    expect(
      getByText(daylistItemMonday, '1 spot remaining')
    ).toBeInTheDocument();
  });
  it('shows the save error when failing to save an appointment', async () => {
    // 0. Mock the mock of axios 'put' to reject with an error
    axios.put.mockRejectedValueOnce('Something went wrong');

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // // 3. Click the "Edit" button on the booked appointment.
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appntmt) =>
      queryByText(appntmt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Change the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'John Lock' },
    });

    // 5. Click the "Save" button to save the changes.
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 7. Wait until the 'Saving' status leaves the DOM, then check that error message is shown
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
    expect(
      getByText(appointment, 'Failed to save Appointment')
    ).toBeInTheDocument();

    // 8. Click the 'close (x) button, and expect to return to the form in edit mode
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByPlaceholderText(appointment, /enter student name/i).value).toBe(
      'John Lock'
    );

    // 9. click the 'Cancel' button on the form, and expect to return to show mode
    fireEvent.click(getByText(appointment, 'Cancel'));
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
    expect(getByAltText(appointment, 'Edit')).toBeInTheDocument();
    expect(getByAltText(appointment, 'Delete')).toBeInTheDocument();

    // 10. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const daylistItems = getAllByTestId(container, 'day');
    const daylistItemMonday = daylistItems.find((dayListItem) =>
      queryByText(dayListItem, 'Monday')
    );
    expect(
      getByText(daylistItemMonday, '1 spot remaining')
    ).toBeInTheDocument();
  });
  it('shows the delete error when failing to delete an existing appointment', async () => {
    // 0. Mock the mock of axios 'delete' to reject with an error
    axios.delete.mockRejectedValueOnce('Something went wrong');

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // // 3. Click the "Delete" button on the booked appointment.
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appntmt) =>
      queryByText(appntmt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        /Are you sure you want to delete this appointment?/i
      )
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the 'Deleting' status leaves the DOM, then check that error message is shown
    await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));
    expect(
      getByText(appointment, /Could not cancel Appointment/i)
    ).toBeInTheDocument();

    // 8. click the 'Cancel' button on the form, and expect to return to show mode
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
    expect(getByAltText(appointment, 'Edit')).toBeInTheDocument();
    expect(getByAltText(appointment, 'Delete')).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const daylistItems = getAllByTestId(container, 'day');
    const daylistItemMonday = daylistItems.find((dayListItem) =>
      queryByText(dayListItem, 'Monday')
    );
    expect(
      getByText(daylistItemMonday, '1 spot remaining')
    ).toBeInTheDocument();
  });
});
