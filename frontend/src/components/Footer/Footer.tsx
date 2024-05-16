import React from 'react'
import style from './styles.module.scss'
import { FaLocationDot } from 'react-icons/fa6'
import { FiPhoneCall } from 'react-icons/fi'
import { MdOutlineAttachEmail } from 'react-icons/md'
import { Image } from '@mantine/core'
import logo from '../../assets/images/logo_transparent.png'
import { FaRegCopyright } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className={style.footerContainer}>
      <div className={style.footerContent}>
        <div className={style.footerCol}>
          <div className={style.footerCoverLogo}>
            <Image src={logo} className={style.footerImage} />
            <p className={style.footerSlogan}>
              Our portfolio includes exquisite properties nestled in prime locations renowned for their desirability.
            </p>
          </div>
        </div>
        <div className={style.footerCol}>
          <div className={style.footerTitleCol}>About us</div>
          <ul className={style.footerContentCol}>
            <li>
              <a className={style.footerLink} href="/home">
                Homepage
              </a>
            </li>
            <li>
              <a className={style.footerLinkDisabled} href="/">
                Introduce
              </a>
            </li>
            <li>
              <a className={style.footerLinkDisabled} href="/" >
                Real Estate
              </a>
            </li>
            <li>
              <a className={style.footerLink} href="/feedback">
                Contact us
              </a>
            </li>
          </ul>
        </div>
        <div className={style.footerCol}>
          <div className={style.footerTitleCol}>Support</div>
          <ul className={style.footerContentCol}>
            <li>
              <a className={style.footerLinkDisabled} href="/">
                FAQs
              </a>
            </li>
            <li>
              <a className={style.footerLinkDisabled} href="/">
                Policy
              </a>
            </li>
            <li>
              <a className={style.footerLinkDisabled} href="/">
                Benefits
              </a>
            </li>
            <li>
              <a className={style.footerLinkDisabled} href="/">
                Site map
              </a>
            </li>
          </ul>
        </div>
        <div className={style.footerCol}>
          <div className={style.footerTitleCol}>Contact us</div>
          <ul className={`${style.footerContentCol} ${style.footerContact}`}>
            <li className={style.footerLink}>
              <FaLocationDot className={style.iconLink} size={20} />
              374 Dien Bien Phu Street
            </li>
            <li className={style.footerLink}>
              <FiPhoneCall className={style.iconLink} size={20} />
              +84 587 666 999
            </li>
            <li className={style.footerLink}>
              <MdOutlineAttachEmail className={style.iconLink} size={20} />
              bigboss23122001@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className={style.footerCopyRight}>
        <FaRegCopyright />
        2024 Modern House. All Rights Reserved
      </div>
    </div>
  )
}

export default Footer
