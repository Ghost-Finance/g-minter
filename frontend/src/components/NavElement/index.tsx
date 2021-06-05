import React, { ReactElement, useState } from 'react'
import useStyles from './style'
import { Drawer, Hidden } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

interface Props {
  children?: JSX.Element[] | JSX.Element
}

const NavElement = ({ children }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <>
      <nav className={classes.root} aria-label="C-Ratio">
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className={classes.content}>
              {children}
            </div>
          </Drawer>
        </Hidden>
      </nav>
    </>
  )
}

export default NavElement
