import React from 'react'
import logo from '../../assets/images/logo_transparent.png'
import MenuBar from '../MenuBar/MenuBar'
import style from './Header.module.scss'
import Drawers from '../Drawers/Drawers'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

export default function Header() {
  const userAuthority = useAppSelector((state) => state.user.roleId)
  return (
    <div className={style.outer}>
      <div className={style.logoOuter}>
        <Link to="/home">
          <img className={style.logo} src={logo}></img>
        </Link>
      </div>
      <MenuBar isOfDrawers={false} userAuthority={userAuthority!} />
      <Drawers />
    </div>
  )
}
