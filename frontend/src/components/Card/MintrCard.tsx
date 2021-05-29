import React from 'react'
import MintrCardBottomImage from '../../assets/mintr-card-bottom.svg'
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core'
import { useStyles } from './style'

const MintrCard = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} variant="h3" component="h2">
          Mint your gDAI
        </Typography>
      </CardContent>
      <CardMedia
        className={classes.media}
        image={MintrCardBottomImage}
      />
    </Card>
  )
}

export default MintrCard