import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GhostRationSimulation from '../../components/GhostRatioComponent/GhostRatioSimulation';
import useStyle from './style';

interface Props {
  backRootPage?: React.MouseEventHandler<HTMLAnchorElement>;
}

const MintPage = ({ backRootPage }: Props) => {
  const classes = useStyle();

  return (
    <div className="modal">
      <Grid container direction="row" className={classes.root}>
        <div>
          <Link to="/" onClick={backRootPage}>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Link>
        </div>
      </Grid>
    </div>
  );
};

export default MintPage;
