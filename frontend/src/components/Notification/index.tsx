import React from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import useStyle from './style'

interface Props {
  message: string;
  icon?: JSX.Element;
  severity?: Color;
}

const Notification = ({ message, icon, severity }: Props) => {
  const classes = useStyle();

  return (
    <Alert icon={icon} severity={severity} color="info" className={`${classes.root} ${classes.standardInfo}`}>
      {message}
    </Alert>
  );
}

export default Notification;
