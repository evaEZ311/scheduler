import React from "react";

import "components/Appointment/style.scss";
import Header from "components/Appointment/Header.js";
import Show from "components/Appointment/Show.js";
import Empty from "components/Appointment/Empty.js";
import Status from "components/Appointment/Status.js";
import Confirm from "components/Appointment/Confirm.js";
import Error from "components/Appointment/Error.js";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form.js";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING= "DELETING";
const CONFIRM= "CONFIRM";
const ERROR_DELETE= "ERROR_DELETE";
const ERROR_SAVE= "ERROR_SAVE";

export default function Appointment(props) {
  const { mode, transition, back } = 
  useVisualMode(
    props.interview ? SHOW : EMPTY
  );

function save(name, interviewer) {
  if ((name === "") ||(interviewer === null)){
    transition(CREATE);
  } else {
  transition(SAVING);
  const interview = {
    student: name,
    interviewer
  }; 
  props.bookInterview(props.id, interview)
  .then(()=>{transition(SHOW);})
  .catch((error)=>{transition(ERROR_SAVE, true)}) 
}
}

function confirm(){
  transition(CONFIRM);
}

function cancel(){
  transition(DELETING, true);
  props.cancelInterview(props.id)
   .then(()=>{transition(EMPTY);})
   .catch((error)=>{transition(ERROR_DELETE, true)})
}

function edit(){
  //transition(CREATE);
  transition(EDIT);
}

  return (
    <article className="appointment">
      <Header time={props.time}></Header>
   
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          cancelInterview = {confirm}
          editInterview = {edit}
        />
      )} 
      {mode === CREATE && <Form 
         interviewers={props.interviews}
         onCancel={()=> back()}
         onSave={save}
      />}
      {mode === EDIT && (<Form
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviews}
        onSave={save}
        onCancel={back}
      />)}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === CONFIRM && <Confirm onCancel={()=>back()} onConfirm={cancel} message="Delete the appointment?"/>}
      {mode === ERROR_SAVE && <Error message="Couldn't save the appointment" onClose={()=>back()}/>}
      {mode === ERROR_DELETE && <Error message="Couldn't delete the appointment" onClose={()=>{back()}}/>}
    </article>
  );
}
