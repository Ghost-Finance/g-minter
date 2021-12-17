import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useStyles from './styles';
import { useSelector } from '../../redux/hooks';
import ProgressBar from '../../components/ProgressBar';
import MainPage from '../MainPage';

const App = (): React.ReactElement => {
  const classes = useStyles();
  const { status } = useSelector(state => state.app);

  return (
    <div className={classes.root}>
      <Router>
        <Switch>
          <Route path="*">
            {status === 'pending' && <ProgressBar />}
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
