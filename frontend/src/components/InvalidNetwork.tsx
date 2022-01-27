import React from 'react';
import { Dialog, withStyles } from '@material-ui/core';
import arrowIconError from '../assets/arrow-icon-red.png';
import InfoCard from './InfoCard';
import { NetworkNames } from '../config/enums';
interface InvalidNetworkProps {
  targetNetwork?: NetworkNames;
  isOpen: boolean;
  onClose?: () => void;
}

const DialogBox = withStyles({
  root: {
    margin: '0 auto',
  },
  paper: {
    backgroundColor: 'transparent',
  },
})(Dialog);

const InvalidNetwork = ({
  targetNetwork,
  isOpen,
  onClose,
}: InvalidNetworkProps) => {
  return (
    <DialogBox open={isOpen} onClose={onClose} maxWidth="xs">
      <InfoCard
        error={true}
        image={arrowIconError}
        text={`Don’t forget, we are on ${targetNetwork} network`}
      />
    </DialogBox>
  );
};

export default InvalidNetwork;
