import React from 'react'
import { Link } from "react-router-dom"
import { Card, CardMedia, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 547,
    maxHeight: 328,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  card: {
    width: '100%',
    height: '100%',
    background: theme.palette.primary.dark,
    boxSizing: 'border-box',
    marginBottom: 12,
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
  to: string
  image: JSX.Element
}

const GcardLink = ({ title, to, image }: Props) => {
  const classes = useStyles()

  return (
    <Link to={to} className={classes.root}>
      <Card title={title} className={classes.card}>
        <CardMedia
          className={classes.media}
          children={image}
        />
      </Card>
    </Link>
  )
}

export default GcardLink
