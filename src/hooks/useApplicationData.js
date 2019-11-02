import { useEffect, useReducer } from "react";
import axios from "axios";

export function useApplicationData(props) {
  const initial = {
    day: "Monday",
    days: [],
    appointments: {}
  };

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, ...action.value };

      case SET_APPLICATION_DATA:
        return { ...state, ...action.value };

      case SET_INTERVIEW:
        return { ...state, ...action.value };

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, initial);

  const setDay = day => dispatch({ type: SET_DAY, value: { day } });

  //update data from api
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      dispatch({
        type: SET_APPLICATION_DATA,
        value: { days, appointments, interviewers }
      });
    });
  }, []);

  //book interview
  function bookInterview(id, interview) {
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({ type: SET_INTERVIEW, value: { appointments } });
      })
      .then(() => {
        Promise.all([
          Promise.resolve(axios.get("http://localhost:8001/api/days")),
          Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
          Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
        ]).then(all => {
          const days = all[0].data;
          const appointments = all[1].data;
          const interviewers = all[2].data;

          dispatch({
            type: SET_APPLICATION_DATA,
            value: { days, appointments, interviewers }
          });
        });
      });
  }

  //cancel interview
  function cancelInterview(id, interview) {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({ type: SET_INTERVIEW, value: { appointments } });
      })
      .then(() => {
        Promise.all([
          Promise.resolve(axios.get("http://localhost:8001/api/days")),
          Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
          Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
        ]).then(all => {
          const days = all[0].data;
          const appointments = all[1].data;
          const interviewers = all[2].data;

          dispatch({
            type: SET_APPLICATION_DATA,
            value: { days, appointments, interviewers }
          });
        });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
