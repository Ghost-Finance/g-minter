import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
  backRootPage?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StakePage = ({ backRootPage }: Props) => (
  <div className="page">
    <Link to="/" onClick={backRootPage}>
      <IconButton>
        <CloseIcon />
      </IconButton>
    </Link>
    StakePage
  </div>
);

export default StakePage;
