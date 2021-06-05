import React, { ReactElement, useState } from 'react'
import useStyles from './style'
import { AppBar, Drawer, Hidden, IconButton, Toolbar } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useTheme } from '@material-ui/core/styles'
import { LogoIcon } from '../../components/Icons'
import GhostRatio from '../../components/GhostRatio'

interface Props {
  window?: () => Window
}

const NavElement = ({ window }: Props): ReactElement => {
  const classes = useStyles()
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined

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
              <LogoIcon />
              <GhostRatio />
            </div>
          </Drawer>
        </Hidden>
      </nav>
    </>
  )
}

export default NavElement
