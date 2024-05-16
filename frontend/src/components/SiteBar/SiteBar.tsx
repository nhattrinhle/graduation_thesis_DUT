import React from 'react'
import ButtonCustom from '../CustomButton/ButtonCustom'
import styles from './SiteBar.module.scss'
import { Avatar } from '@mantine/core'

export default function SiteBar() {
  return (
    <>
      <div className={styles.outer}>
        <div className="bg-second flex flex-col justify-center items-center gap-y-5 pt-7">
          <Avatar size={100} />
          <ButtonCustom text="My Account" bg="#396652"></ButtonCustom>
          <ButtonCustom text="Wish List" bg="#396652"></ButtonCustom>
          <ButtonCustom text="Payment" bg="#396652"></ButtonCustom>
          <ButtonCustom text="Change Password" bg="#396652"></ButtonCustom>
          <ButtonCustom text="Sign Out" bg="#396652"></ButtonCustom>
        </div>
        <div></div>
      </div>
    </>
  )
}
