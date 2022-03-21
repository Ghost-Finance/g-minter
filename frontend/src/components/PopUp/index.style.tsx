import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    popUpWrapper: {
      height: 'calc(100vh - 60px)',
      left: '50%',
      position: 'absolute',
      top: '50%',
      width: '95%',
      zIndex: 200,
      transform: 'translate(-50%, -50%)',
    },
    popUp: {
      alignItems: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '101%',
      display: 'flex',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      [theme.breakpoints.down('sm')]: {
        backgroundSize: 'cover',
      },
    },
    popUpCover: {
      backgroundColor: 'rgba(51, 51, 51, 0.4)',
      height: '100%',
      left: 0,
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      width: '100%',
      zIndex: 1,
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
      margin: '4rem 0 0',
      position: 'absolute',
      top: '0',
      left: '50%',
      zIndex: 210,
      width: '40vw',
      transform: 'translateX(-50%)',
      [theme.breakpoints.down('sm')]: {
        top: '6rem',
        width: '70%',
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
      '&:first-of-type': {
        marginRight: '10px',
      },
    },
    prevButton: {
      marginBottom: '-2px',
    },
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
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      borderBottom: `4px solid ${theme?.brand.main}`,
      display: 'flex',
      flexDirection: 'column',
      marginTop: '8rem',
      paddingTop: '2rem',
      position: 'relative',
      width: '40vw',
      minHeight: '20vw',
      zIndex: 2,
      '&::before': {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderTopLeftRadius: '48px',
        borderTopRightRadius: '48px',
        content: '""',
        height: '2.5rem',
        position: 'absolute',
        top: '-2.5rem',
        width: '60%',
        zIndex: 2,
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
