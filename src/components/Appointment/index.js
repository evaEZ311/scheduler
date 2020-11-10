import React from "react";

import "components/Appointment/style.scss";
import Header from "components/Appointment/Header.js";
import Show from "components/Appointment/Show.js";
import Empty from "components/Appointment/Empty.js";
import Status from "components/Appointment/Status.js";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form.js";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING= "DELETING";
const CONFIRM= "CONFIRM";

export default function Appointment(props) {
  const { mode, transition, back } = 
  useVisualMode(
    props.interview ? SHOW : EMPTY
  );

function save(name, interviewer) {
  transition(SAVING);
  const interview = {
    student: name,
    interviewer
  }; 
  props.bookInterview(props.id, interview)
  .then(()=>{transition(SHOW);})
  .catch((error)=>{console.error(error);})
  
}

function cancel(){
  transition(DELETING);
  
  props.cancelInterview(props.id)
  .then(()=>{transition(EMPTY);})
  .catch((error)=>{console.error(error);})
  
}

function edit(){
  transition(CREATE);
}

  return (
    <article className="appointment">
      <Header time={props.time}></Header>
   
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          cancelInterview = {cancel}
          editInterview = {edit}
        />
      )} 
      {mode === CREATE && <Form 
         interviewers={props.interviews}
         onCancel={()=> back()}
         onSave={save}
        />}
      {mode === SAVING && <Status message="Saving"/>}
    </article>
  );
}
