import * as React from 'react';
import InputMask from 'react-input-mask';

export const NumericalInput = (props: any) => (
  <InputMask mask={/\d((\.)\d+)?/g} {...props} />
);
