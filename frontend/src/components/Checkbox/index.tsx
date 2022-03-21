import React from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';
import { useStyles } from './index.style';

interface Props {
  label: JSX.Element;
  checked?: boolean;
  value?: string | number | any;
}

const Checkbox = ({ label, checked, value }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.checkboxWrapper}>
      <FormControlLabel
        value={value}
        control={<Radio className={`${classes.checkBoxInput}`} />}
        label={
          <div className={`${classes.gridCenter} ${classes.label}`}>
            {label}
          </div>
        }
        labelPlacement="end"
        className={`${classes.checkbox} ${
          checked ? classes.checkboxYellow : classes.checkboxGrey
        }`}
      />
    </div>
  );
};

export default Checkbox;
