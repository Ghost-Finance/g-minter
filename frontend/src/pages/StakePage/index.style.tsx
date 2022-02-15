import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    pageWrapper: {
      display: 'block',
    },
  })
);

export default useStyle;
