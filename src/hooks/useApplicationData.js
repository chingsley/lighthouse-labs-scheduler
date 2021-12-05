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

  const bookInterview = (id, interview, isEditing = false) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    let days = [...state.days];

    console.log({ isEditing });

    if (!isEditing) {
      days = state.days.map((d) => {
        if (d.name === state.selectedDay) {
          return { ...d, spots: d.spots - 1 };
        } else {
          return d;
        }
      });
    }

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState({ ...state, appointments, days });
      })
      .catch((error) => {
        throw error;
      });
  };

  const cancelInterview = (appointmentId) => {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment,
    };

    const days = state.days.map((d) => {
      if (d.name === state.selectedDay) {
        return { ...d, spots: d.spots + 1 };
      } else {
        return d;
      }
    });

    return axios
      .delete(`/api/appointments/${appointmentId}`)
      .then(() => {
        setState({ ...state, appointments, days });
      })
      .catch((error) => {
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
    cancelInterview,
  };
}
