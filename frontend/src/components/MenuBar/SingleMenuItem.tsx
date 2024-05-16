import { NavigationTree } from '../../types/navigation'
import { Menu } from '@mantine/core'
import React from 'react'
import styles from './MenuBar.module.scss'
import { NavLink } from 'react-router-dom'

interface MenuItemProps {
  nav: NavigationTree
  closeDrawer?: () => void
  activeLink: string
}

export default function SingleMenuItem({
  nav,
  closeDrawer,
  activeLink,
}: MenuItemProps) {
  const OPEN_DELAY = 50
  const CLOSE_DELAY = 50

  return (
    <>
      <Menu trigger="click" openDelay={OPEN_DELAY} closeDelay={CLOSE_DELAY}>
        <Menu.Target>
          <NavLink
            key={nav.key}
            to={nav.path}
            className={styles.navLink}
            onClick={closeDrawer}
          >
            <div className=" flex flex-col justify-center py-0">
              <h1 className={styles.navText}>{nav.title}</h1>
              <span
                className={`h-[3px] mt-2 bg-[#ffa500] ${activeLink.includes(nav.path) ? 'opacity-100' : 'opacity-0'}`}
              ></span>
            </div>
          </NavLink>
        </Menu.Target>
      </Menu>
    </>
  )
}
