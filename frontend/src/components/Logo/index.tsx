import React from 'react'
import { withStyles, Typography } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const styles = () => ({
  root: {
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '36px',
    color: '#fff'
  }
})

const Logo = () => {
  const matches = useMediaQuery('(max-width:600px)')
  return (
    <Typography
      variant="h6"
      style={matches ? { fontSize: '14px' } : { fontSize: '1.25rem' }}
    >
      GHOST
    </Typography>
  )
}

export default withStyles(styles as any)(Logo)
