import React from 'react'
import { Card, CardMedia, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 547,
    maxHeight: 328,
    background: theme.palette.primary.dark,
    boxSizing: 'border-box',
    marginBottom: 12,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  media: {
    backgroundPosition: 'bottom',
    width: '100%',
    height: '100%',
    paddingTop: '1%',
  },
}))

interface Props {
  title: string
  image: JSX.Element
}

const Gcard = ({ title, image }: Props) => {
  const classes = useStyles()

  return (
    <Card className={classes.root} title={title}>
      <CardMedia
        className={classes.media}
        children={image}
      />
    </Card>
  )
}

export default Gcard