import React from 'react'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { FaBuilding } from 'react-icons/fa'
import { AiFillLike } from 'react-icons/ai'
import { MdEmojiEmotions } from 'react-icons/md'
import style from './BannerValue.module.scss'
const BannerValue = () => {
  return (
    <div className={style.bannerContainer}>
      <div className={style.bannerContent}>
        <div className={style.bannerContentCol}>
          <FaBuilding className={style.bannerIcon} />
          <span className={style.bannerText}>ELEGANT APARTMENT</span>
        </div>
        <div className={style.bannerContentCol}>
          <BsFillBuildingsFill className={style.bannerIcon} />
          <span className={style.bannerText}>LUXURY HOUSES</span>
        </div>
        <div className={style.bannerContentCol}>
          <AiFillLike className={style.bannerIcon} />
          <span className={style.bannerText} >SATISFIED GUESTS</span>
        </div>
        <div className={style.bannerContentCol}>
          <MdEmojiEmotions className={style.bannerIcon} />
          <span className={style.bannerText}>HAPPY OWNERS</span>
        </div>
      </div>
    </div>
  )
}

export default BannerValue
