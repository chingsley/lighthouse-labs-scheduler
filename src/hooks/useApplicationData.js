import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useApplicationData() {
  const [state, setState] = useState({
    selectedDay: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

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

  return {
    state,
    setSelectedDay,
    bookInterview,
    cancelInterview
  };
}
