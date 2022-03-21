import React, { useState } from 'react';
import { ContentPage } from '../ContentPage';
import CardContent from '../../components/CardContent';
import PopUp from '../../components/PopUp';
import StakeForm from './StakeForm';

const StakePage = () => {
  const [chosenStake, setChosenStake] = useState<any>();

  return (
    <>
      {(!chosenStake && <PopUp changeStake={setChosenStake} />) || (
        <ContentPage showCancel={true} backgroundImage={chosenStake.background}>
          <CardContent typeCard="stake">
            <StakeForm synth={chosenStake} />
          </CardContent>
        </ContentPage>
      )}
    </>
  );
};

export default StakePage;
