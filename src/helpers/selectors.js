function getAppointmentsForDay(state, day) {
  if (Array.isArray(state.days) && state.days.length === 0) {
      return state.days;
  } else {
    const filteredDay = state.days.filter(specificDay => specificDay.name === day);

    if (Array.isArray(filteredDay) && filteredDay.length === 0) {
      return filteredDay;
    } else {
      const appointments = filteredDay[0]["appointments"];
    
      let appointmentsForDay = [];
      appointments.forEach((appointment)=> {
        appointmentsForDay.push(state.appointments[appointment]);
      });
      return appointmentsForDay;
    }
  }
};

function getInterview(state, interview){
  const getInterview ={};
  if(interview === null){
    return null
  } else {
    const interviewerId = interview.interviewer;
    
    getInterview.interviewer = state.interviewers[interviewerId];
    getInterview.student = interview.student;
    
    return getInterview;
  }
};

function getInterviewersForDay(state, day) {
  if (Array.isArray(state.days) && state.days.length === 0) {
      return state.days;
  } else {
    const filteredDay = state.days.filter(specificDay => specificDay.name === day);

    if (Array.isArray(filteredDay) && filteredDay.length === 0) {
      return filteredDay;
    } else {
      const interviewers = filteredDay[0]["interviewers"];
    
      let interviewersForDay = [];
    
      interviewers.forEach((interviewer)=> {
        interviewersForDay.push(state.interviewers[interviewer]);
      });
      return interviewersForDay;
    }
  }
};

module.exports = {getAppointmentsForDay,getInterview, getInterviewersForDay};