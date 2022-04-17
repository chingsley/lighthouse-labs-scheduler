import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from './application';

const wsUri = process.env.REACT_APP_WEBSOCKET_URL;

// import { socket } from '../utils/socketUtils';

console.log("process.env.REACT_APP_WEBSOCKET_URL: ", process.env.REACT_APP_WEBSOCKET_URL);

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

  const bookInterview = (id, interview, isEditing) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    let days = [...state.days];

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
        dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
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
        dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchAppData = () => Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers'),
  ]);

  useEffect(() => {
    fetchAppData()
      .then((responses) => {
        dispatch({ type: SET_APPLICATION_DATA, value: { responses } });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(wsUri);

    socket.onopen = () => { };

    socket.onmessage = event => {
      const obj = JSON.parse(event.data);
      if (obj.type === SET_INTERVIEW) {
        fetchAppData()
          .then(all => {
            const [{ data: days }, { data: appointments }, { data: interviewers }] = all;
            console.log({ days, appointments, interviewers });
            return dispatch({ type: obj.type, value: { days, appointments, interviewers } });
          }

          );
      }
    };

  }, []);

  return {
    state,
    setSelectedDay,
    bookInterview,
    cancelInterview,
  };
}
