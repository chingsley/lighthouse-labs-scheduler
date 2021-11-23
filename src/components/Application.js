import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from 'components/DayList';
import Appointment from './Appointment';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';

/**
 *
 * AVAILABLE API's
 * "GET_DAYS":     http://localhost:8001/api/days,
"GET_APPOINTMENTS": http://localhost:8001/api/appointments,
"GET_INTERVIEWERS": http://localhost:8001/api/interviewers,
 */

export default function Application() {
  const [state, setState] = useState({
    selectedDay: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });


  const dailyAppointments = getAppointmentsForDay(state, state.selectedDay);
  const dailyInterviewers = getInterviewersForDay(state, state.selectedDay);

  const setSelectedDay = (selectedDay) => {
    setState({ ...state, selectedDay });
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        setState({ ...state, appointments });
        return res;
      }).catch(error => {
        throw error;
      });
  };

  const cancelInterview = (appointmentId) => {
    return axios.delete(`/api/appointments/${appointmentId}`)
      .then((res) => {
        console.log('res = ', res);
        setState(prev => {
          // const { interview } = prev.appointments.find(id => id === appointmentId);
          return {
            ...prev,
            appointments: { ...prev.appointments, [appointmentId]: { ...prev.appointments[appointmentId], interview: null } },
          };
        });
        return res;
      }).catch(error => {
        throw error;
      });
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ])
      .then((responses) => {
        // console.log(responses);
        setState((prev) => ({
          ...prev,
          days: responses[0].data,
          appointments: responses[1].data,
          interviewers: responses[2].data,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const schedule = dailyAppointments.map((appointment) => {
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
        {schedule}
        <Appointment key='last' time='5pm' /> {/* Do not forget this */}
      </section>
    </main>
  );
}
