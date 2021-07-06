import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      flexGrow: 1,
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.light,
      width: '100%',
      height: '100%',
    },
    paperTop: {
      width: '100%',
      height: 300,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundColor: theme.palette.primary.dark,
    },
    content: {
      position: 'relative',
      top: '-250px',
      width: 'calc(30%)',
    },
    paperContent: {
      display: 'flex',
      // position: 'absolute',
      alignItems: 'flex-end',
    },
  })
);

export default useStyle;
