import React, { useState, useEffect } from 'react';

import { Redirect } from 'react-router-dom';

//import { Grid } from '@material-ui/core';
import useStyle from './index.style';
import { useSelector } from '../../redux/hooks';
import PopUp from '../../components/PopUp';

const StakePage = () => {
  const { account } = useSelector(state => state.wallet);
  const [redirectHome, setRedirectHome] = useState(false);
  const classes = useStyle();

  useEffect(() => {
    setRedirectHome(account === null);
  }, [account]);
  return (
    <>
      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}

      <PopUp />
    </>
  );
};

export default StakePage;
