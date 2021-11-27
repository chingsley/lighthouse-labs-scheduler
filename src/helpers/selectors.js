export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  const dayObj = days.find((d) => d.name.toLowerCase() === day.toLowerCase());

  if (state.days.length === 0 || dayObj === undefined) return [];

  return dayObj.appointments.map((id) => appointments[id]);
}


export function getInterviewersForDay(state, day) {
  const { days, interviewers } = state;

  const dayObj = days.find((d) => d.name.toLowerCase() === day.toLowerCase());

  if (state.days.length === 0 || dayObj === undefined) return [];

  return dayObj.interviewers.map((id) => interviewers[id]);
}

export function getInterview(state, appointmentInterview) {
  // returns null if no interview is booked
  if (!appointmentInterview) return null;

  const { student: studentName, interviewer: interviewerId } =
    appointmentInterview;
  return {
    student: studentName,
    interviewer: state.interviewers[interviewerId],
  };
}



// export function getInterview(state, interview) {
//   // returns null if no interview is booked
//   if (!interview) return null;

//   return {
//     student: interview.student,
//     interviewer: state.interviewers[interview.interviewer],
//   };
// }
