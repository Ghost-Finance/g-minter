import React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const StakePage = () => (
  <div className="page">
    <Link to="/">
      <IconButton><CloseIcon/></IconButton>
    </Link>
    StakePage
  </div>
)

export default StakePage
