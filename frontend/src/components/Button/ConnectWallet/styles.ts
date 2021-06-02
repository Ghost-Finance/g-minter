import { makeStyles } from "@material-ui/core";


export default makeStyles((theme) => ({
    root: {
      borderRadius: '100px',
      border: `4px solid ${theme.palette.primary.light}`,
      boxSizing: 'border-box',  
      textAlign: 'center',
      padding: '12px 25px',
      margin: '10px',
      maxWidth: '210px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.dark,
      '&:hover': {
        borderColor: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.light
      }    
    },
    rootLoading: {
        border: `1px solid ${theme.palette.warning.main}`,
    },
    badge: {
        backgroundColor: theme.palette.secondary.contrastText,
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        marginRight: '8px'
    },
    badgeLoading: {
        backgroundColor: theme.palette.warning.main
    },
    label: {
        color: theme.palette.secondary.contrastText,
        fontSize: '14px',
        textAlign: 'center',
        lineHeight: '17px',
        textTransform: 'none'
    },
    labelLoading: {
        color: theme.palette.warning.main
    }
  }))
