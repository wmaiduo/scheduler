import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "./DayList";

import "components/Application.scss";
import Appointment from "./Appointment";

import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function bookInterview(id, interview) {
    console.log(id, interview);
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
      console.log(all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, [])
  const setDay = (day) => setState((prev) => ({ ...prev, day }));
  // const setDays = (days) => setState((prev) => ({ ...prev, days }));
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const appointmentsArray = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        id={appointment.id}
      />
    );
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
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />{" "}
      </section>
      <section className="schedule">
        {appointmentsArray}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
