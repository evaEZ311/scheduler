import React from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview,getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

//const axios = require('axios').default;

export default function Application(props) {
//axios.get("/api/debug/reset");

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const AppointmentInterviewer = getInterviewersForDay(state,state.day);

  const appointmenttag = dailyAppointments.map(appointment => { 
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
