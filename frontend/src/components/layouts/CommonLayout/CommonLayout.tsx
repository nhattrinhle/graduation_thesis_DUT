import React from 'react'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import style from './CommonLayout.module.scss'
import Views from '../../../views/Views'

export default function Layout() {
  return (
    <>
      <div className={style.outer}>
        <div className={style.inner}>
          <Header />
        </div>
      </div>
      <Views />
      <Footer />
    </>
  )
}
