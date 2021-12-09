
import { useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';

import { socket } from '../utils/socketUtils';


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, selectedDay: action.value };
    case SET_APPLICATION_DATA:
      const { responses } = action.value;
      return {
        ...state,
        days: responses[0].data,
        appointments: responses[1].data,
        interviewers: responses[2].data,
      };
    case SET_INTERVIEW: {
      const { appointments, days } = action.value;
      return { ...state, appointments, days };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}



export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    selectedDay: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setSelectedDay = (selectedDay) => {
    dispatch({ type: SET_DAY, value: selectedDay });
  };

  const setInterview = useCallback((appointmentId, interview, changeInSpotsCount) => {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: interview
    };

    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment
    };

    const days = state.days.map(d => {
      if (d.name === state.selectedDay) {
        return { ...d, spots: d.spots + changeInSpotsCount };
      } else {
        return d;
      }
    });
    dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
  }, [state.appointments, state.days, state.selectedDay]);

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        // setInterview(id, interview, -1);
      }).catch(error => {
        throw error;
      });
  };

  const cancelInterview = (appointmentId) => {
    return axios.delete(`/api/appointments/${appointmentId}`)
      .then(() => {
        // setInterview(appointmentId, null, 1);
      }).catch(error => {
        throw error;
      });
  };

  useEffect(() => {

    socket.onmessage = function (event) {
      console.log(event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'SET_INTERVIEW') {
        console.log('data = ', data);
        const { id, interview } = data;
        const changeInSpotsCount = interview ? -1 : 1;
        setInterview(id, interview, changeInSpotsCount);
      }
    };
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ])
      .then((responses) => {
        dispatch({ type: SET_APPLICATION_DATA, value: { responses } });
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
