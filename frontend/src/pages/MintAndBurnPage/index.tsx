import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { AppBar, Grid, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import useStyles from './style';
import ContentPage from '../ContentPage';
import CardContent from '../../components/CardContent';
import BurnPage from '../BurnPage';
import MintPage from '../MintPage';

const MintAndBurnPage = () => {
  const [value, setValue] = React.useState('mint');
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ContentPage>
      <CardContent>
        <TabContext value={value}>
          <AppBar position="static">
            <TabList onChange={handleChange} aria-label="mint or burn">
              <Tab label="Mint" value="mint" />
              <Tab label="Burn" value="burn" />
            </TabList>
          </AppBar>
          <TabPanel value="mint">
            <h1>Mint</h1>
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
