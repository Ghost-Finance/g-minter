import React from 'react'
import {
  makeStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'
import theme from '../../theme'

interface Props {
  label: string
  icon?: JSX.Element
  valueNumber?: number
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '100px',
    border: `1px solid ${theme.palette.secondary.main}`,
    boxSizing: 'border-box',
    fontSize: '14px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.secondary.contrastText
  },
  value: {
    color: theme.palette.secondary.contrastText
  }
}))

const ItemSynths = ({ label, icon, valueNumber = 0 }: Props) => {
  const classes = useStyles(theme)

  return (
    <ListItem className={classes.root}>
      <ListItemAvatar>
        <div>{icon}</div>
      </ListItemAvatar>
      <ListItemText primary={label} />
      <ListItemSecondaryAction className={classes.value}>
        {Number(valueNumber).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ItemSynths
