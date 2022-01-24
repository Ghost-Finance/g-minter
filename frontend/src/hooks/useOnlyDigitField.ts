import { ChangeEventHandler, useState, Dispatch } from 'react';

const REGEX = /^[+-]?\d*(?:[.,]\d*)?$/;

interface P {
  type: string;
  value: string;
  valid: boolean;
  reset: Function;
  onChange: ChangeEventHandler;
  setValue: Dispatch<string>;
}

const useOnlyDigitField = (type: string): P => {
  const [valid, setValid] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const onChange = (e: any) => {
    e.preventDefault();
    let value = e.target.value.trim();
    if (REGEX.test(value) || value.lenght <= e.target.maxLenght) {
      setValid(true);
      setValue(e.target.value.trim());

      return;
    }
  };

  const reset = () => {
    setValid(false);
    setValue('');
  };

  return {
    type,
    value,
    valid,
    reset,
    onChange,
    setValue,
  };
};

export default useOnlyDigitField;
