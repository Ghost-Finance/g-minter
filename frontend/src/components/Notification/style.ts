import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: '24px',
      '& > * + *': {
        marginTop: theme.spacing(2),
        fontSize: '16px',
        fontWeight: 800,
        color: theme.brand.main,
      },
    },
    standardInfo: {
      backgroundColor: theme.brand.dark
    },
  })
);

export default useStyle;
