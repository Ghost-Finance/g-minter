import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AppBar, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import useStyles from './style';
import ContentPage from '../ContentPage';
import CardContent from '../../components/CardContent';
import BurnPage from '../BurnPage';
import MintPage from '../MintPage';

const MintAndBurnPage = () => {
  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [page, setPage] = useState('mint');
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newPage: string) => {
    setPage(newPage);
  };

  return (
    <ContentPage>
      {redirect ? (
        <Redirect
          to={{
            pathname: '/alert',
          }}
        />
      ) : null}

      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}
      <CardContent>
        <TabContext value={page}>
          <AppBar position="static">
            <TabList onChange={handleChange} aria-label="mint or burn">
              <Tab label="Mint" value="mint" />
              <Tab label="Burn" value="burn" />
            </TabList>
          </AppBar>
          <TabPanel value="mint">
            <MintPage />
          </TabPanel>
          <TabPanel value="burn">
            <BurnPage />
          </TabPanel>
        </TabContext>
      </CardContent>
    </ContentPage>
  );
};

export default MintAndBurnPage;
