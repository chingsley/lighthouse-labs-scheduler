export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  const dayObj = days.find((d) => d.name.toLowerCase() === day.toLowerCase());

  if (state.days.length === 0 || dayObj === undefined) return [];

  return dayObj.appointments.map((id) => appointments[id]);
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
