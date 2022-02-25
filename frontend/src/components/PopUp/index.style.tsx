import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    popUpWrapper: {
      left: '4%',
      position: 'absolute',
      top: '5vh',
      width: '92%',
      zIndex: 200,
    },
    popUp: {
      backgroundColor: theme?.palette.primary.light,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '101%',
      padding: '14rem 0 7rem',
      [theme.breakpoints.down('sm')]: {
        backgroundSize: 'cover',
      },
    },
    closePopUp: {
      backgroundColor: theme?.palette.primary.dark,
      '&:hover': {
        backgroundColor: theme?.palette.primary.light,
      },
      borderRadius: '1.5rem',
      cursor: 'pointer',
      display: 'inline-block',
      margin: '3rem 3rem 1.5rem 3rem',
      padding: '1rem 1.125rem',
      position: 'absolute',
      top: '0',
      zIndex: 210,
    },
    popUpHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      margin: '4rem 0 0 20.375rem',
      position: 'absolute',
      top: '0',
      zIndex: 210,
      width: '40%',

      [theme.breakpoints.down('sm')]: {
        margin: '0 auto',
        left: '5vw',
        top: '6rem',
        width: '90vw',
      },
    },
    link: {
      color: theme?.palette.secondary.dark,
      textDecoration: 'none',
      fontSize: '0.825rem',
      fontWeight: 'bold',
    },
    navButton: {
      border: 'none',
      borderRadius: '50%',
      backgroundColor: theme?.palette.primary.dark,
      cursor: 'pointer',
      height: '48px',
      width: '48px',
    },
    prevButton: {},
    nextButton: {
      right: '3.5rem',
      transform: 'rotate(180deg)',
    },
    buttonImage: {
      height: '1rem',
      width: '1.125rem',
    },
    popupText: {
      color: theme?.palette.secondary.main,
      fontSize: '2rem',
      maxWidth: '15rem',
    },
    popUpContent: {
      alignItems: 'center',
      backgroundColor: 'rgba(30, 30, 30, 0.5)',
      borderBottom: `4px solid ${theme?.brand.main}`,
      display: 'flex',
      flexDirection: 'column',
      margin: '2rem 0 0 20.375rem',
      paddingTop: '2rem',
      position: 'relative',
      width: '40%',
      '&::before': {
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        borderTopLeftRadius: '48px',
        borderTopRightRadius: '48px',
        content: '""',
        height: '2.5rem',
        position: 'absolute',
        top: '-2.5rem',
        width: '60%',
      },

      [theme.breakpoints.down('sm')]: {
        margin: '6rem auto 0 auto',
        width: '70%',
      },
    },
    popUpLogo: {
      marginLeft: '2rem',
      position: 'relative',
      '&::before': {
        backgroundColor: theme?.palette.background.default,
        borderRadius: '50%',
        content: '""',
        height: '80px',
        position: 'absolute',
        top: '-1rem',
        left: '-1rem',
        width: '80px',
        zIndex: -1,
      },
    },
    popUpTitle: {
      color: theme?.palette.secondary.main,
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1,
      marginBottom: 0,
    },
    popUpSubtitle: {
      color: theme?.palette.secondary.dark,
      fontSize: '1.5rem',
      margin: '0.5rem 0 3rem 0',
    },
  })
);

export default useStyle;
