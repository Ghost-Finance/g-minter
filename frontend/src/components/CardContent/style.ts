import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'flex-start',
    },
    cardForm: {
      marginTop: 20,
      width: 'calc(60%)',
      backgroundColor: '#393939',
      border: 1,
      [theme.breakpoints.down(1800)]: {
        marginTop: 0,
      },
    },
  })
);

export default useStyle;
