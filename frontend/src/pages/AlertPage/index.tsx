import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@material-ui/core';
import useStyle from './index.style';
import { ContextPage } from '../ContentPage';
import ConfirmTransactionMessage from './AlertMessage/ConfirmTransactionMessage';
import WaitingTransactionMessage from './AlertMessage/WaitingTransactionMessage';
import SuccessTransactionMessage from './AlertMessage/SuccessTransactionMessage';
import ErrorTransactionMessage from './AlertMessage/ErrorTransactionMessage';
import { useSelector } from '../../redux/hooks';
import { useMinter } from '../../hooks/useContract';
import { filterByEvent } from '../../utils/calls';

let CONFIRM_TRANSACTION: string = 'confirm';
let WAITING_TRANSACTION: string = 'waiting';
let SUCCESS_TRANSACTION: string = 'finish';
let ERROR_TRANSACTION: string = 'error';

const AlertPage = () => {
  const classes = useStyle();
  const [message, setMessage] = useState('confirm');
  //const [confirmed, setConfirmed] = useState(false);
  const [isFirstTransaction, setIsFirstTransaction] = useState(false);
  const { status } = useSelector((state) => state.app);
  const { account } = useSelector((state) => state.wallet);
  const { action } = useContext(ContextPage);
  const minterContract = useMinter();

  const messageComponents = {
    [CONFIRM_TRANSACTION]: () => <ConfirmTransactionMessage />,
    [WAITING_TRANSACTION]: () => <WaitingTransactionMessage />,
    [SUCCESS_TRANSACTION]: () => (
      <SuccessTransactionMessage
        isFirstTransaction={isFirstTransaction}
        currentAction={action}
      />
    ),
    [ERROR_TRANSACTION]: () => <ErrorTransactionMessage />,
  };

  useEffect(() => {
    setMessage(status as string);
    filterByEvent(minterContract, 'Mint', account as string).then((data) => {
      if (data.length) {
        setIsFirstTransaction(false);
      } else {
        setIsFirstTransaction(true);
      }
    });
  }, [status, minterContract, account]);

  return (
    <div className="modal">
      <Grid container direction="column" className={classes.root}>
        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            {(messageComponents[message as string] &&
              messageComponents[message as string]()) ||
              messageComponents[CONFIRM_TRANSACTION]()}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AlertPage;
