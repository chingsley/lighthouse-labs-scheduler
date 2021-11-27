
import { useEffect, useReducer } from 'react';
import axios from 'axios';


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

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = state.days.map(d => {
      if (d.name === state.selectedDay) {
        return { ...d, spots: d.spots - 1 };
      } else {
        return d;
      }
    });

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
      }).catch(error => {
        throw error;
      });
  };

  const cancelInterview = (appointmentId) => {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment
    };

    const days = state.days.map(d => {
      if (d.name === state.selectedDay) {
        return { ...d, spots: d.spots + 1 };
      } else {
        return d;
      }
    });

    return axios.delete(`/api/appointments/${appointmentId}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
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
