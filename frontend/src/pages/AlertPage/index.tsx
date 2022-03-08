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

interface Props {
  open?: boolean;
}

const AlertPage = ({ open }: Props) => {
  const classes = useStyle();
  const [message, setMessage] = useState('');
  const [messageAction, setMessageAction] = useState('');
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
        currentAction={messageAction as string}
      />
    ),
    [ERROR_TRANSACTION]: () => <ErrorTransactionMessage />,
  };

  useEffect(() => {
    setMessage(
      (status as string) === 'success' ? 'finish' : (status as string)
    );
    setMessageAction(action);
    filterByEvent(minterContract, 'Mint', account as string).then((data) => {
      if (data.length) {
        setIsFirstTransaction(false);
      } else {
        setIsFirstTransaction(true);
      }
    });
  }, [status, action, minterContract, account]);
  debugger;
  return (
    <div
      className={`${classes.alert} ${open ? classes.active : classes.close}`}
    >
      <Grid container direction="column" className={classes.root}>
        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            {messageComponents[message as string] &&
              messageComponents[message as string]()}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AlertPage;
