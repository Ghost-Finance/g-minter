import React from 'react'
import { withStyles, Typography } from '@material-ui/core'

const styles = () => ({
  root: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '1.25rem',
    lineHeight: '36px',
    color: '#fff'
  }
})

const Logo = () => {
  return <Typography variant="h6">GHOST</Typography>
}

export default withStyles(styles as any)(Logo)
