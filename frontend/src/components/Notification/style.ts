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
    standardSuccess: {
      backgroundColor: theme.palette.success.main,
    },
    standardError: {
      backgroundColor: theme.palette.error.main,
    },
    standardWarning: {
      backgroundColor: theme.palette.warning.main,
    }
  })
);

export default useStyle;
