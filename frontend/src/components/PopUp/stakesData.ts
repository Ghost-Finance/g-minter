import SpaceXBackground from '../../assets/images/space-x.jpeg';
import NeuraLinkBackground from '../../assets/images/neuralink.png';
import MadeInSpaceBackground from '../../assets/images/made-in-space.jpeg';

import SpaceXLogo from '../../assets/SPX.svg';
import NeuralinkLogo from '../../assets/Neuralink.svg';
import MadeInSpaceLogo from '../../assets/MadeInSpace.svg';

const stakesData = [
  {
    key: process.env.GSPACEX_KEY,
    background: SpaceXBackground,
    logo: SpaceXLogo,
    title: 'SpaceX',
    subtitle: 'gSPX',
  },
  {
    key: process.env.GNEURALINK_KEY,
    background: NeuraLinkBackground,
    logo: NeuralinkLogo,
    title: 'Neuralink',
    subtitle: 'gNLK',
  },
  {
    key: process.env.GMADEINSPACE_KEY,
    background: MadeInSpaceBackground,
    logo: MadeInSpaceLogo,
    title: 'Made in Space',
    subtitle: 'gMIS',
  },
];

export default stakesData;
