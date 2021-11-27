import React from 'react';

import 'components/Application.scss';
import DayList from 'components/DayList';
import Appointment from './Appointment';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';
// import useApplicationData from 'hooks/useApplicationData';
import useApplicationData from 'reducers/useApplicationData';

/**
 *
 * AVAILABLE API's
 * "GET_DAYS":     http://localhost:8001/api/days,
"GET_APPOINTMENTS": http://localhost:8001/api/appointments,
"GET_INTERVIEWERS": http://localhost:8001/api/interviewers,
 */
export default function Application() {
  const {
    state,
    setSelectedDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.selectedDay);
  const dailyInterviewers = getInterviewersForDay(state, state.selectedDay);

  const appointmentsComponents = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={() => cancelInterview(appointment.id)}
      />
    );
  });

  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>
          <DayList
            days={state.days}
            selectedDay={state.selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </nav>
        <img
          className='sidebar__lhl sidebar--centered'
          src='images/lhl.png'
          alt='Lighthouse Labs'
        />
      </section>
      <section className='schedule'>
        {appointmentsComponents}
        <Appointment key='last' time='5pm' /> {/* Do not forget this */}
      </section>
    </main>
  );
}
