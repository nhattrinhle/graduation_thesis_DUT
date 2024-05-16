import { Image } from '@mantine/core'
import React from 'react'
import banner from '../../assets/images/BannerWelcomeImage3.png'
import style from './BannerWelcome.module.scss'
const BannerWelcome = () => {
  return (
    <div className={style.bannerWelcomeContainer}>
      <div className={style.bannerWelcomeContent}>
        <div className={style.bannerWelcomeText}>
          <div className="flex flex-col md:gap-y-10 mobile:gap-y-5 my-0">
            <h4 className={style.bannerTitle}>Your Satisfaction</h4>
            <h2 className={style.bannerSubTitle}>Is Our Priority</h2>
          </div>

          <p className={style.bannerDescription}>
            Determined to uphold the highest standards, our seasoned team of
            experts stands prepared to deliver individualized support and expert
            guidance.
          </p>
        </div>
        <div className={style.bannerWelcomeText}>
          <Image
            src={banner}
            className={style.bannerWelcomeImage}
            alt="building"
          />
        </div>
      </div>
    </div>
  )
}

export default BannerWelcome
