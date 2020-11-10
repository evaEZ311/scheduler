import React, { useState, useEffect} from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview,getInterviewersForDay } from "helpers/selectors";
//import { useVisualMode } from "hooks/useVisualMode";

const axios = require('axios').default;

const getSpotsForDay = (day, appointments) => day.appointments.length - day.appointments
  .reduce((count, id) => (appointments[id].interview ? count + 1 : count), 0);

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
    const days = state.days.map(day => { 
      return day.appointments.includes(id)
      ? {...day, spots: getSpotsForDay(day, appointments)}
      : day;     
    });
    
    return axios.put("/api/appointments/"+id, appointment)
      .then((res) => {
        const resObj=JSON.parse(res.config.data);
        const interview = resObj.interview;
      setState({
        ...state,
        days,
        appointments
      });
    }); 
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    const days = state.days.map(day => { 
      return day.appointments.includes(id)
      ? {...day, spots: getSpotsForDay(day, appointments)}
      : day;     
    });
    
    return axios.delete("/api/appointments/"+id,appointment)
    .then(() => {
      setState({
        ...state,
        days,
        appointments
      });
    });
    
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
