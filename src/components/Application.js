import React, { useState, useEffect} from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview,getInterviewersForDay } from "helpers/selectors";
//import { useVisualMode } from "hooks/useVisualMode";

const axios = require('axios').default;

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const AppointmentInterviewer = getInterviewersForDay(state,state.day);

  const setDay = day => setState({ ...state, day });
  
  useEffect(()=> {Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments"),
    axios.get("api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})); 
    });
  },[]);


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({
      ...state,
      appointments
    });
    
   //axios.get("/api/debug/reset");
    return axios.put("/api/appointments/"+id, {interview: interview})
      .then((res) => {
        //console.log("res.data");
        //console.log(res.config.data);
        const resObj=JSON.parse(res.config.data);
        const interview = resObj.interview;
     
      //console.log(interview);
      const appointment = {
        ...state.appointments[id],
        interview
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
  
      setState({
        ...state,
        appointments
      });
      //console.log(state);
    });
  
  }

  function cancelInterview(id) {
    console.log(id);
  
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({
      ...state,
      appointments
    });
    console.log(state);
    
    axios.put("/api/appointments/"+id, ).catch((e)=>{console.log(e.response.data)})
  
    //  .then((res) => {
    //    console.log("res.data");
    //    console.log(res.config.data);
    /*    
        const resObj=JSON.parse(res.config.data);
        const interview = resObj.interview;
     
      //console.log(interview);
      const appointment = {
        ...state.appointments[id],
        interview
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
  
      setState({
        ...state,
        appointments
      });
      //console.log(state);
    */
  //  });
    
  }

  const appointmenttag = 
  dailyAppointments.map(appointment => { 
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
      key={appointment.id}
      id = {appointment.id}
      time = {appointment.time}
      interview = {interview}
      interviews = {AppointmentInterviewer}
      bookInterview = {bookInterview}
      cancelInterview = {cancelInterview}
    />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
       {/*
        
        <DayList days={state.days} day={state.day} setDay={setDay} />
       */}
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmenttag}
        <Appointment key="last" time="5pm" /> 
      </section>
    </main>
  );
}
