import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: 0,
      marginBottom: 0,
      backgroundColor: theme.brand.main,
      zIndex: 99999,
    },
  })
);

export default useStyle;
