import React, { useState, useEffect } from "react";

import "components/Application.scss";

import axios from "axios";

import DayList from "components/DayList";

import Appointment from "./Appointment";

import { getAppointmentsForDay } from "../helpers/selector";

import { getInterview } from "../helpers/selector";

import { getInterviewersForDay } from "../helpers/selector";



export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      setState(prev => ({ ...prev, days, appointments, interviewers }))
    })
  }, [])

  function bookInterview(id, interview) {                 //book interview

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then (() => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
  
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
  
      setState(state => ({ ...state, appointments }));
    })

  }

  function cancelInterview(id, interview) {                //cancel interview

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() =>
        setState(state => {
          const appointment = {
            ...state.appointments[id],
            interview: null
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          return { ...state, appointments }
        })
      )
  }


  const todayInterviewers = getInterviewersForDay(state, state.day);

  const todayAppointments = getAppointmentsForDay(state, state.day);

  const appointment = todayAppointments.map((appointment) => {

    let interview = getInterview(state, appointment.interview)

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={todayInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  })

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
