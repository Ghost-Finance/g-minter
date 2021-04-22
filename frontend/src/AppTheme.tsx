import React from 'react'
import App from './App'
import {
  createMuiTheme,
  CssBaseline,
  makeStyles,
  ThemeProvider
} from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import {
  TOKEN_NEUTRAL_COLOR_LOW_DARK,
  TOKEN_NEUTRAL_COLOR_LOW_PURE,
  TOKEN_NEUTRAL_COLOR_LOW_LIGHT,
  TOKEN_NEUTRAL_COLOR_HIGH_DARK,
  TOKEN_NEUTRAL_COLOR_HIGH_LIGHT,
  TOKEN_NEUTRAL_COLOR_HIGH_PURE,
  TOKEN_FEEDBACK_COLOR_POSITIVE_PURE,
  TOKEN_FEEDBACK_COLOR_POSITIVE_DARK,
  TOKEN_FEEDBACK_COLOR_NEGATIVE_PURE,
  TOKEN_FEEDBACK_COLOR_NEGATIVE_DARK,
  TOKEN_BACKGROUND_COLOR_DEFAULT
} from './tokens'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: TOKEN_NEUTRAL_COLOR_LOW_DARK,
      dark: TOKEN_NEUTRAL_COLOR_LOW_PURE,
      light: TOKEN_NEUTRAL_COLOR_LOW_LIGHT
    },
    secondary: {
      main: TOKEN_NEUTRAL_COLOR_HIGH_PURE,
      dark: TOKEN_NEUTRAL_COLOR_HIGH_DARK,
      light: TOKEN_NEUTRAL_COLOR_HIGH_LIGHT
    },
    error: {
      main: TOKEN_FEEDBACK_COLOR_NEGATIVE_PURE,
      dark: TOKEN_FEEDBACK_COLOR_NEGATIVE_DARK
    },
    success: {
      main: TOKEN_FEEDBACK_COLOR_POSITIVE_PURE,
      dark: TOKEN_FEEDBACK_COLOR_POSITIVE_DARK
    },
    background: {
      default: TOKEN_BACKGROUND_COLOR_DEFAULT
    }
  },
  typography: {
    fontFamily: 'Inter',
    caption: {
      color: '#fff'
    }
  }
})

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
