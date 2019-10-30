

export function getAppointmentsForDay (state, day) {
  let result = [];
  const apptArray = state.days.filter (obj => obj.name === day)
    let arr = apptArray[0].appointments;
    if (arr.length > 0) {
      for (let appNum of arr) {
        result.push(state.appointments[appNum])
      }
    } else {
      return []
    }
  return result;
}


export function getInterview(state, interview) {
  let result = {};

  const interviewer = state.interviewers.filter(obj => obj.name === interview );
  const appointmentsForInterviewer = state.appointments.filter (obj => obj.interview.interviewer === interviewer[0]);
  console.log(appointmentsForInterviewer)
}



