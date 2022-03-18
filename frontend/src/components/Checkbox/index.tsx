import React from 'react';

import { useStyles } from './index.style';

interface Props {
  image?: string;
  label: string;
  yellow?: boolean;
  rotate?: boolean;
}

const Checkbox = ({ yellow, image, label, rotate }: Props) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.checkboxWrapper} ${
        yellow ? classes.checkboxYellow : classes.checkboxGrey
      }`}
    >
      <label htmlFor={label}>
        <img
          alt={label}
          src={image}
          className={`${classes.labelImage} ${rotate &&
            classes.labelImageRotate}`}
        />
        {label}
      </label>
      <input id={label} type="checkbox" className={classes.checkBoxInput} />
    </div>
  );
};

export default Checkbox;
