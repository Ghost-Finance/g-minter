import React from 'react'
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'
import { MintCardIcon, BurnCardIcon, RewardCardIcon, SynthCardIcon } from '../../components/Icons'
import CssBaseline from '@material-ui/core/CssBaseline'
import NavElement from '../../components/NavElement'
import Gcard from '../../components/Gcard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    column: {
      top: '70px',
      minHeight: '0'
    },
    columnFixed: {
      position: 'sticky',
      overflowY: 'auto',
      flexShrink: 0,
      width: '100%',
    },
    item: {
      paddingTop: '70px',
      padding: theme.spacing(1),
    },
  })
)

interface Props {
  account: string
  networkName: string
}

const Main = ({ account, networkName }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavElement />
      <main className={classes.main}>
        <Grid container>
          <Grid item className={classes.columnFixed} >
            <div className={classes.item}>
              <Gcard title="Mint gDAI" image={<MintCardIcon/>} />

              <Gcard title="Mint and Burn" image={<BurnCardIcon/>} />

              <Gcard title="Claim Rewards" image={<RewardCardIcon/>} />

              <Gcard title="Stake Synths" image={<SynthCardIcon/>} />
            </div>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default Main
