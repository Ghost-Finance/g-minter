import React from 'react'
import { Link } from "react-router-dom"
import { Card, CardMedia } from '@material-ui/core'
import useStyles from './style'
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
