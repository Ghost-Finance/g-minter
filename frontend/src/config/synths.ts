// background image
import SpaceXBackground from '../assets/images/space-x.jpeg';
// icons
import SpaceXIcon from '../assets/spaceX-logo.svg';

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
      process?.env?.GSPACEX_KEY ||
      '0x4753504143455800000000000000000000000000000000000000000000000000',
    background: SpaceXBackground,
    logo: SpaceXIcon,
    title: 'SpaceX',
    subtitle: 'gSPX',
  },
] as Array<SynthData>;
