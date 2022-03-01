// background image
import SpaceXBackground from '../assets/images/space-x.jpeg';
// icons
import { SpaceXIcon } from '../components/Icons';

require('dotenv').config();

export interface SythData {
  key: string;
  background: string;
  logo: JSX.Element;
  title: string;
  subtitle: string;
}

export const stakesData = [
  {
    key: process.env.GSPACEX_KEY,
    background: SpaceXBackground,
    logo: <SpaceXIcon />,
    title: 'SpaceX',
    subtitle: 'gSPX',
  } as SythData,
];
