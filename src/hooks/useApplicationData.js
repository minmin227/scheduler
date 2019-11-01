import React, { useState, useEffect } from 'react';
import axios from 'axios';


export function useApplicationData(props) {

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

  //book interview
  function bookInterview(id, interview) {
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
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

  //cancel interview
  function cancelInterview(id, interview) {
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

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
