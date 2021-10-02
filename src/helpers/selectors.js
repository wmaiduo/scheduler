export function getAppointmentsForDay(state, name) {
  const filteredDay = state.days.filter(day => day.name === name);
  const filteredAppointments = filteredDay[0] ? filteredDay[0].appointments : [];
  const result = [];
  for (const filteredAppointment of filteredAppointments) {
    result.push(state.appointments[filteredAppointment])
  }
  return result; 
}

export function getInterviewersForDay(state, name) {
  const filteredDay = state.days.filter(day => day.name === name);
  const filteredAppointments = filteredDay[0] ? filteredDay[0].appointments : [];
  const result = [];
  for (const filteredAppointment of filteredAppointments) {
    if (state.appointments[filteredAppointment].interview) {
    const interViewerNumber = state.appointments[filteredAppointment].interview.interviewer;
    result.push(state.interviewers[interViewerNumber])
    }
  }
  return result; 
}

export function getInterview(state, interview) {
  return interview ? { ...interview, interviewer: state.interviewers[interview.interviewer] } : null;
}