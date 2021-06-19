import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 30,
      marginBottom: 30,
    },
    content: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 240,
      maxHeight: 80,
      backgroundColor: theme.palette.primary.light,
      borderRadius: 24,
    },
    image: {
      width: 56,
      height: 50,
    },
    img: {
      margin: '10px auto',
      display: 'block',
      maxWidth: '60%',
      maxHeight: '60%',
    },
    title: {
      color: theme.palette.primary.contrastText,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '1rem',
      paddingTop: 10,
    },
    arrowIcon: {
      width: 151,
    },
  })
);

export default useStyle;
