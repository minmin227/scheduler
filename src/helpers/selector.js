export const getInterviewersForDay = (state, day) => {
  const result = [];
  const filteredDay = state.days.filter(days => days.name === day);
  if(filteredDay.length > 0) {
    filteredDay[0].interviewers.forEach(itv => {
      if(state.interviewers[itv]) {
        result.push(state.interviewers[itv])
      }
    });
  }
  return result;
}

export const getAppointmentsForDay = (state, day) => {
  const result = [];
  const filteredDay = state.days.filter(days => days.name === day);
  if(filteredDay.length > 0) {
    filteredDay[0].appointments.forEach(appt => {
      if(state.appointments[appt]) {
        result.push(state.appointments[appt])
      }
    });
  }
  return result;
}

export function getInterview(state, interview) {
  const result = {};
  if (!interview) return null;
  let interviewerID = interview.interviewer;
  let check = Object.keys(state.interviewers);
  for (let ea of check) {
    if (Number(ea) === interviewerID){
      result.interviewer = state.interviewers[ea];
      result.student = interview.student;
    }
  }
  return result
}
