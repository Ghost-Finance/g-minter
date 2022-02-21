import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    coverImage: {
      height: '300px',
      left: 0,
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      width: '100vw',
    },
    formWrapper: {
      alignItems: 'center',
      borderBottom: `4px solid ${theme?.brand.main}`,
      backgroundColor: theme?.palette.primary.light,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: '5.75rem',
      position: 'absolute',
      top: '12.5rem',
      right: '5.5rem',
      width: '60%',
      '&::before': {
        backgroundColor: theme?.palette.primary.light,
        borderTopLeftRadius: '48px',
        borderTopRightRadius: '48px',
        content: '""',
        height: '3rem',
        left: '30%',
        position: 'absolute',
        top: '-3rem',
        width: '40%',
      },
    },
    formTitle: {
      color: theme?.palette.secondary.main,
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1,
      marginTop: '6rem',
      marginBottom: 0,
    },
    formSubtitle: {
      color: theme?.palette.secondary.dark,
      fontSize: '1.5rem',
      lineHeight: 1,
      marginBottom: '5.5rem',
    },
    formLine: {
      display: 'flex',
      marginBottom: '1rem',
      height: '3rem',
    },
    formOption: {
      border: 'none',
      borderRadius: '24px',
      fontFamily: 'Inter',
      fontWeight: 700,
      margin: '0 1rem',
      padding: '1rem',
    },
    formOptionShort: {
      backgroundColor: theme?.palette.primary.dark,
      color: theme?.palette.secondary.light,
      '&:hover': {
        backgroundColor: theme?.palette.primary.main,
      },
    },
    formOptionLong: {
      backgroundColor: '#1E2000',
      color: theme?.brand.main,
      '&:hover': {
        backgroundColor: '#2b2e00',
      },
    },
    formOptionImage: {
      height: '11px',
      marginRight: '0.5rem',
      width: '11px',
    },
    formOptionImageShort: {
      transform: 'rotate(270deg)',
    },
    formInfoImage: {
      height: '24px',
      marginRight: '1rem',
      width: '29px',
    },
    formInfoText: {
      color: theme?.palette.secondary.main,
      marginRight: 'auto',
    },
    formInfoMax: {
      backgroundColor: 'transparent',
      border: `2px solid ${theme?.palette.primary.light}`,
      borderRadius: '18px',
      color: theme?.palette.secondary.main,
      padding: '0.25rem 0.625rem',
      textTransform: 'uppercase',
      '&:hover': {
        backgroundColor: theme?.palette.primary.light,
      },
    },
    formText: {
      color: theme?.palette.secondary.dark,
    },
    formSubmit: {
      backgroundColor: theme?.brand.main,
      border: 'none',
      borderRadius: '24px',
      fontWeight: 600,
      margin: '6rem 0',
      padding: '0.75rem 0',
      width: '18.75rem',
    },
    formInput: {
      padding: '15px',
      marginBottom: '10px',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      width: '100px',
      color: '#fff',
      marginTop: '10px',
      marginLeft: '55px',
      letterSpacing: '0.008em',
    },
  })
);

export default useStyle;
