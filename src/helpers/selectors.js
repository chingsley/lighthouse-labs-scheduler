export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  const dayObj = days.find((d) => d.name.toLowerCase() === day.toLowerCase());

  if (state.days.length === 0 || dayObj === undefined) return [];

  return dayObj.appointments.map((id) => appointments[id]);
}
