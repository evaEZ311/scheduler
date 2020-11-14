import React from "react";

export default function Confirm(props) {
  return (
    <main className="appointment__card appointment__card--confirm">
      <h2 className="text--regular">{props.message}</h2>
      <section>
        <button className="appointment__card-left--confirm button button--danger" onClick={props.onCancel}>Cancel</button>
        <button className="aappointment__card-right--confirm button button--danger" onClick={props.onConfirm}>Confirm</button>
      </section>
    </main>
  );
}