import React from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import useStyle from './style';

interface Props {
  message: string;
  icon?: JSX.Element;
  color: 'info' | 'success' | 'error' | 'warning';
  severity?: Color;
}

const Notification = ({ message, icon, color, severity }: Props) => {
  const classes = useStyle();
  const colorClasses = {
    info: classes.standardInfo,
    success: classes.standardSuccess,
    error: classes.standardError,
    warning: classes.standardWarning,
  }[color];

  return (
    <Alert
      icon={icon}
      severity={severity}
      className={`${classes.root} ${colorClasses}`}
    >
      {message}
    </Alert>
  );
};

export default Notification;
