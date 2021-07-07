import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: theme.palette.primary.contrastText,
      left: '30%',
      width: '100%',
      height: '100%',
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
