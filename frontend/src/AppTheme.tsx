import React from 'react'
import App from './App'
import {
  createMuiTheme,
  CssBaseline,
  makeStyles,
  ThemeProvider
} from '@material-ui/core'
import { SnackbarProvider } from 'notistack'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#171717'
    }
  },
  typography: {
    caption: {
      color: '#fff'
    }
  }
})

const useStyles = makeStyles({
  root: {
    background: '#171717',
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: 0
  }
})

const AppTheme = () => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={1}>
        <div className={classes.root}>
          <App />
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default AppTheme
