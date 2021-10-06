import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function getSpots() {
    // const updatedDays = state.days;
    let appointmentsForDay = [];
    let daysID;
    for (const id in state.days) {
      if (state.day === state.days[id].name) {
        appointmentsForDay = state.days[id].appointments;
        daysID = state.days[id].id;
      }
    }
    let result = 0;
    for (const id of appointmentsForDay) {
      if (!state.appointments[id].interview) {
        ++result;
      }
    }
    return {result, daysID};
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then((response) => {
        const {result, daysID} = getSpots();
        let updatedDays = state.days;
        updatedDays[daysID - 1].spots = result - 1;
        setState({ ...state, appointments, days: updatedDays });
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, {})
      .then((response) => {
        console.log("called");
        const appointment = {
          ...state.appointments[id],
          interview: null,
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        console.log(getSpots());
        const {result, daysID} = getSpots();
        let updatedDays = state.days;
        updatedDays[daysID - 1].spots = result + 1;
        setState({ ...state, appointments, days: updatedDays });
      });
  }

  useEffect(() => {
    const daysURL = "http://localhost:8001/api/days";
    const appointmentsURL = "http://localhost:8001/api/appointments";
    const interviewresURL = "http://localhost:8001/api/interviewers";
    Promise.all([
      Promise.resolve(axios.get(daysURL)),
      Promise.resolve(axios.get(appointmentsURL)),
      Promise.resolve(axios.get(interviewresURL)),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);
  const setDay = (day) => setState((prev) => ({ ...prev, day }));
  return { state, setDay, bookInterview, cancelInterview };
}
