import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
    },
    main: {
      flexGrow: 1,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    column: {
      minHeight: '0',
    },
    columnFixed: {
      top: 0,
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
      height: 'calc(100vh - 10px)',
    },
    item: {
      padding: theme.spacing(1),
    },
    walletGrid: {
      paddingTop: 48,
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
    },
  })
);
