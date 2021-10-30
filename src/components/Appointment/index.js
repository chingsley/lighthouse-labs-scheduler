import React from 'react';

import 'components/Appointment/styles.scss';

export default function Appointment(props) {
  const { time } = props;
  const message = time ? `Appiontment at ${time}` : 'No Appointments';
  return <article className='appointment'>{message}</article>;
}
