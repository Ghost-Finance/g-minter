import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
  checkboxWrapper: {
    border: 'none',
    borderRadius: '24px',
    fontFamily: 'Inter',
    fontWeight: 700,
    margin: '0 1rem 25px',
    padding: '1rem',
  },
  checkboxYellow: {
    backgroundColor: '#1E2000',
    color: theme?.brand.main,
    '&:hover': {
      backgroundColor: '#2b2e00',
    },
  },
  checkboxLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxGrey: {
    backgroundColor: theme?.palette.primary.dark,
    color: theme?.palette.secondary.light,
    '&:hover': {
      backgroundColor: theme?.palette.primary.main,
    },
  },
  label: {
    color: theme.palette.secondary.dark,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: '15px',
  },
  labelImage: {
    height: '11px',
    marginRight: '0.5rem',
    width: '11px',
  },
  labelImageRotate: {
    transform: 'rotate(270deg)',
  },
  checkBoxInput: {
    display: 'none',
  },
}));
