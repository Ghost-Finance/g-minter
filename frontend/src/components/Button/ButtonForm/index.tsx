import React from 'react';
import theme from '../../../theme';
import { Button } from '@material-ui/core';
import useStyles from './styles';

interface Props {
  text: string;
  className?: string;
  children?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const ButtonForm = ({
  text,
  className,
  children,
  onClick,
}: Props): React.ReactElement => {
  const classes = useStyles(theme);

  return (
    <Button
      variant="contained"
      disableElevation
      className={`${classes.root} ${className}`}
      onClick={() => onClick}
    >
      {text || children}
    </Button>
  );
};

export default ButtonForm;
