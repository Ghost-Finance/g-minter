import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import useStyles from './styles';
import MainPage from '../MainPage';
import AppMenu from '../AppMenu';

export default (): React.ReactElement => {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <AppMenu />
      <Router>
        <Switch>
          <Route path="*">
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}
