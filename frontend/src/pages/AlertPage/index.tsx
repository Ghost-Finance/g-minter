import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@material-ui/core';
import useStyle from './index.style';
import ConfirmTransactionMessage from './AlertMessage/ConfirmTransactionMessage';
import WaitingTransactionMessage from './AlertMessage/WaitingTransactionMessage';
import SuccessTransactionMessage from './AlertMessage/SuccessTransactionMessage';
import ErrorTransactionMessage from './AlertMessage/ErrorTransactionMessage';
import { useSelector } from '../../redux/hooks';
import { useMinter } from '../../hooks/useContract';
import { ContextPage } from '../ContentPage';

let CONFIRM_TRANSACTION: string = 'confirm';
let WATING_TRANSACTION: string = 'waiting';
let SUCCESS_TRANSACTION: string = 'finish';
let ERROR_TRANSACTION: string = 'error';

const AlertPage = () => {
  const classes = useStyle();
  const [message, setMessage] = useState('confirm');
  //const [confirmed, setConfirmed] = useState(false);
  const [isFirstTransaction, setIsFirstTransaction] = useState(false);
  const { status } = useSelector(state => state.app);
  const minterContract = useMinter();
  const { mintAction } = useContext(ContextPage);

  const messageComponents = {
    [CONFIRM_TRANSACTION]: () => <ConfirmTransactionMessage />,
    [WATING_TRANSACTION]: () => <WaitingTransactionMessage />,
    [SUCCESS_TRANSACTION]: () => (
      <SuccessTransactionMessage
        isFirstTransaction={isFirstTransaction}
        isMintAction={mintAction}
      />
    ),
    [ERROR_TRANSACTION]: () => <ErrorTransactionMessage />,
  };

  useEffect(() => {
    setMessage(status as string);

    minterContract
      .getPastEvents(
        'Mint',
        {
          filter: { to: '0xb57CFE0d5950F7760FE90caA831BC8552aA5921C' },
          fromBlock: 0,
          toBlock: 'latest',
        },
        (error, data) => console.log(data)
      )
      .then(events => {
        if (events.length) {
          setIsFirstTransaction(false);
        } else {
          setIsFirstTransaction(true);
        }
      });
  }, [status, minterContract]);

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
