import SpaceXBackground from '../assets/images/space-x.jpeg';
import NeuraLinkBackground from '../assets/images/neuralink.png';
import MadeInSpaceBackground from '../assets/images/made-in-space.jpeg';

import SpaceXLogo from '../assets/images/spaceX-logo.png';
import NeuralinkLogo from '../assets/images/neuralink-logo.png';
import MadeInSpaceLogo from '../assets/images/madeinspace-logo.png';

require('dotenv').config();

export interface SynthData {
  key: string;
  background: string;
  logo: string;
  title: string;
  subtitle: string;
  amount?: number;
}

export const stakesData = [
  {
    key:
      process.env.GSPACEX_KEY ||
      '0x4753504143455800000000000000000000000000000000000000000000000000',
    background: SpaceXBackground,
    logo: SpaceXLogo,
    title: 'SpaceX',
    subtitle: 'gSPX',
  },
  // {
  //   key: process.env.GNEURALINK_KEY,
  //   background: NeuraLinkBackground,
  //   logo: NeuralinkLogo,
  //   title: 'Neuralink',
  //   subtitle: 'gNLK',
  // },
  // {
  //   key: process.env.GMADEINSPACE_KEY,
  //   background: MadeInSpaceBackground,
  //   logo: MadeInSpaceLogo,
  //   title: 'Made in Space',
  //   subtitle: 'gMIS',
  // },
] as Array<SynthData>;
