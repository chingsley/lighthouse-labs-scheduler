export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

export default function reducer(state, action) {
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
