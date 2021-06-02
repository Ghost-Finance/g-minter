import React, { useRef } from 'react'
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group"
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom"
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'
import { MintCardIcon, BurnCardIcon, RewardCardIcon, SynthCardIcon } from '../../components/Icons'
import MintPage from '../MintPage'
import BurnPage from '../BurnPage'
import RewardPage from '../RewardPage'
import StakePage from '../StakePage'
import GhostRatio from '../../components/GhostRatio'
import GcardLink from '../../components/GcardLink'
import './style.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingLeft: 0,
      paddingRight: 0
    },
    column: {
      top: '70px',
      minHeight: '0'
    },
    columnFixed: {
      top: '60px',
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
      height: 'calc(100vh - 10px)'
    },
    item: {
      paddingTop: '60px',
      padding: theme.spacing(1),
    },
  })
)

interface Props {
  account: string
  networkName: string
}

const MainPage = ({ account, networkName }: Props) => {
  const classes = useStyles()
  const location = useLocation()

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item className={classes.column} xs={12} md={4} sm={4}>
          <div className={classes.item}>
            <GhostRatio />
          </div>
        </Grid>
        <Grid item className={classes.columnFixed} xs={12} md={8} sm={8}>
          <div className={classes.item}>
            <div>
              <GcardLink to="/mint" title="Mint gDAI" image={<MintCardIcon/>} />

              <GcardLink to="/mint-burn" title="Mint and Burn" image={<BurnCardIcon/>} />

              <GcardLink to="/rewards" title="Claim Rewards" image={<RewardCardIcon/>} />

              <GcardLink to="/stake" title="Stake Synths" image={<SynthCardIcon/>} />
            </div>
            <TransitionGroup>
              <CSSTransition
                timeout={300}
                key={location.key}
                classNames="fade"
              >
                <Switch location={location}>
                  <Route path="/mint" children={<MintPage />}  />
                  <Route path="/mint-burn" children={<BurnPage />}  />
                  <Route path="/rewards" children={<RewardPage />} />
                  <Route path="/stake" children={<StakePage />} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default MainPage
