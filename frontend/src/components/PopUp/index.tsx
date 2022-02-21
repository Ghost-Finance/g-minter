import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';

import stakesData from './stakesData';

import useStyle from './index.style';

import arrow from '../../assets/arrow.png';

type Stake = {
  key: string | undefined;
  title: string;
  subtitle: string;
  logo: string;
  background: string;
};

interface PopUpProps {
  changeStake?: any;
}

const PopUp = ({ changeStake }: PopUpProps) => {
  const classes = useStyle();
  const [isPopupOpen, setIsPopUpOpen] = useState(true);

  const closePopup = (stake: Stake) => {
    changeStake(stake);
    setIsPopUpOpen(false);
  };

  if (!isPopupOpen) return null;

  return (
    isPopupOpen && (
      <div className={classes.popUpWrapper}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.prev',
            nextEl: '.next',
          }}
          centeredSlides
        >
          <div className={classes.closePopUp}>
            <Link to="/" className={classes.link}>
              Cancel
            </Link>
          </div>

          <div className={classes.popUpHeader}>
            <p className={classes.popupText}>Choose a gSynth</p>
            <div>
              <button
                className={`prev ${classes.prevButton} ${classes.navButton}`}
              >
                <img
                  alt="Previous slide"
                  src={arrow}
                  className={classes.buttonImage}
                />
              </button>
              <button
                className={`next ${classes.nextButton} ${classes.navButton}`}
              >
                <img
                  alt="Next slide"
                  src={arrow}
                  className={classes.buttonImage}
                />
              </button>
            </div>
          </div>

          {stakesData.map(item => (
            <SwiperSlide key={item.title}>
              <div
                className={`side-left ${classes.popUp}`}
                style={{
                  backgroundImage: `url(${item.background})`,
                }}
              >
                <div
                  className={classes.popUpContent}
                  onClick={() => closePopup(item)}
                >
                  <img
                    className={classes.popUpLogo}
                    alt={item.title}
                    src={item.logo}
                  />
                  <p className={classes.popUpTitle}>{item.title}</p>
                  <p className={classes.popUpSubtitle}>{item.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
};

export default PopUp;
