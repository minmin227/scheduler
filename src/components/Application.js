import React, { useState, useEffect } from "react";

import "components/Application.scss";

import axios from "axios";

import DayList from "components/DayList";

import Appointment from "./Appointment";

import { getAppointmentsForDay } from "../helpers/selector";



export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: []
  })

  const setDay = day => setState({ ...state, day });

  const appointment = state.appointments.map(appointment =>
    <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
    />
  )

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      console.log(appointments);
      const interviewers = all[2].data;
      const todayAppointments = getAppointmentsForDay({ days, appointments }, state.day);
      return setState({ ...state, days: days, appointments: todayAppointments });

    })
  }, [])




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
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {appointment}
      </section>
    </main>
  );
}
