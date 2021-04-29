import React from 'react'
import App from './App'
import { CssBaseline, makeStyles, MuiThemeProvider } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import theme from './theme'

const useStyles = makeStyles({
  root: {
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: 0
  }
})

const AppTheme = () => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={1}>
        <div className={classes.root}>
          <App />
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}

export default AppTheme
