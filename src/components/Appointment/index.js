import "components/Appointment/styles.scss"
import React from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const CREATE = "CREATE";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {

  function save(name, interviewer) {                        //function save
    transition(SAVING)

    const interview = {
      student: name,
      interviewer
    };
  
    return props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch((error) => {
      transition(ERROR_SAVE, true)
    })
  }

  function cancel() {                                       //function cancel
    transition (DELETING, true)

    return props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch((error) => {
      transition(ERROR_DELETE, true)
    })
  }

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
  <article className="appointment" data-testid="appointment">
    <Header time={props.time} />

    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SAVING && <Status message = "Saving"/>}
    {mode === DELETING && <Status message = "Deleting" />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete = {()=> transition(CONFIRM)}
        onEdit = {() => transition(EDIT)}

      />
    )}
    {mode === CREATE && (
      <Form
        name={props.name}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />
    )}
    {mode === CONFIRM && (
      <Confirm 
      message = "Are you sure to delete ?"
      onConfirm = {cancel}
      onCancel = {back}
      />
    )} 
    {mode === EDIT && (
    <Form
      name={props.interview.student}
      interviewers={props.interviewers}
      onCancel={back}
      onSave={save}
    />
    )}
    {mode === ERROR_DELETE && 
    <Error
      message = "Cannot delete because something is wrong with your server"
      onClose = {back}
    />
    }

{mode === ERROR_SAVE && 
    <Error
      message = "Cannot save because something is wrong with your server"
      onClose = {back}
    />
    }
  </article>
  )
}