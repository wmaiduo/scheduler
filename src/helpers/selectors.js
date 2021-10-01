export function getAppointmentsForDay(state, name) {
  const filteredDay = state.days.filter(day => day.name === name);
  const filteredAppointments = filteredDay[0] ? filteredDay[0].appointments : [];
  const result = [];
  for (const filteredAppointment of filteredAppointments) {
    result.push(state.appointments[filteredAppointment])
  }
  return result; 
}