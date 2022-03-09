import { ReactElement } from 'react';
import useStyles from './style';
import { Drawer } from '@material-ui/core';

interface Props {
  children?: JSX.Element[] | JSX.Element;
  styleWithBackgound?: boolean;
}

const NavElement = ({ children, styleWithBackgound }: Props): ReactElement => {
  const classes = useStyles();

  return (
    <>
      <nav className={classes.root} aria-label="C-Ratio">
        <Drawer
          classes={{
            paper: styleWithBackgound
              ? classes.drawerPaper
              : classes.drawerPaperWithoutBackground,
          }}
          variant="permanent"
          open
        >
          <div className={classes.content}>{children}</div>
        </Drawer>
      </nav>
    </>
  );
};

export default NavElement;
