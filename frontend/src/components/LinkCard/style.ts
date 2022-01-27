import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 30,
      marginBottom: 0,
    },
    content: {
      backgroundColor: theme.palette.primary.light,
      borderRadius: 24,
    },
    contentInternalLeft: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 'auto',
      width: 141,
      height: 190,
    },
    contentInternalRight: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: 'auto',
      width: 390,
      height: 192,
      backgroundColor: theme.palette.primary.dark,
      borderRadius: '0 20px 20px 0',
    },
    image: {
      width: 56,
    },
    img: {
      margin: '0px auto',
      marginLeft: 38,
      marginBottom: 18,
      display: 'block',
      maxWidth: '60%',
      maxHeight: '60%',
    },
    imgInfo: {
      margin: '0px auto',
    },
    title: {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 24,
      display: 'flex',
      alignItems: 'center',
      color: theme?.brand.main,
      marginLeft: 35,
    },
    subTitle: {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 24,
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      marginLeft: 38,
    },
    arrowIcon: {
      width: 151,
    },
    link: {
      textDecoration: 'none',
      margin: 0,
      padding: 0,
    },
  })
);

export default useStyle;
