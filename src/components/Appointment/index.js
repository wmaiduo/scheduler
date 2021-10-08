import React, { Fragment } from "react";

import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const SAVING = "SAVING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const EDIT = "EDIT";

export default function Appointment(props) {
  let { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  function showDelete() {
    transition(CONFIRM);
  }

  function confirmDelete() {
    props
      .cancelInterview(props.id)
      .then((response) => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
    transition(DELETING, true);
  }

  function confirmCancel() {
    transition(EMPTY);
  }

  return (
    <Fragment>
      <Header time={props.time} />
      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty />} */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={showDelete}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={confirmDelete}
          onCancel={confirmCancel}
        />
      )}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === ERROR_SAVE && <Error message="Could not save" />}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === ERROR_DELETE && (
        <Error message={"could not delete message "} onClose={() => back()} />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
    </Fragment>
  );
}
