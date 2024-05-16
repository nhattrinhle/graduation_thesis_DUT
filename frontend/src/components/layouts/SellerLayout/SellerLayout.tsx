import React, { useEffect, useState } from 'react'
import {
  AppShell,
  Burger,
  Group,
  Anchor,
  Breadcrumbs,
  Divider,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import logo from '../../../assets/images/logo_transparent.png'
import styles from './SellerLayout.module.scss'
import {
  IconDashboard,
  IconUserStar,
  IconGraph,
  IconLogout,
  IconCreditCard,
  IconBuildingSkyscraper,
} from '@tabler/icons-react'
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setIsSmallScreen } from '../../../redux/reducers/resizeSlice'
import { signOutSuccess } from '../../../redux/reducers/sessionSlice'
import { resetUser } from '../../../redux/reducers/userSlice'
import { persistor } from '../../../redux/store'
import Views from '../../../views/Views'

export default function SellerLayout() {
  const navigate = useNavigate()
  const [opened, { toggle }] = useDisclosure()
  const [isSmallNav, setIsSmallNav] = useState(false)
  const SMALL_SCREEN_WIDTH = 70
  const LARGE_SCREEN_WIDTH = 180
  const ICON_SIZE = 30
  const APPSHELL_HEIGHT = 80
  const dispatch = useAppDispatch()
  const isSmallScreen = useAppSelector((state) => state.resize.isSmallScreen)
  const roleId = useAppSelector((state) => state.user.roleId)
  const { pathname } = useLocation()

  const paths = [
    { title: 'Seller', href: '#' },
    pathname === '/seller' || pathname === '/transaction'
      ? { title: 'Dashboard', href: '/seller' }
      : null,
    pathname === '/seller-property'
      ? { title: 'Property', href: '/seller-property' }
      : null,
    pathname === '/seller-profile'
      ? { title: 'Profile', href: '/seller-profile' }
      : null,
    pathname === '/seller-transaction'
      ? { title: 'Transaction History', href: '/seller-transaction' }
      : null,
    pathname === '/seller-report'
      ? { title: 'Report', href: '/seller-report' }
      : null,
    pathname === '/transaction'
      ? { title: 'Transaction', href: '/transaction' }
      : null,
  ]
    .filter(Boolean)
    .map((path, index) => (
      <Anchor
        href={path?.href}
        key={index}
        className={
          location.pathname === path?.href || path?.title === 'Seller'
            ? 'text-gray-700 hover:no-underline cursor-default'
            : 'text-gray-700'
        }
        onClick={(e) => {
          if (location.pathname === path?.href || path?.title === 'Seller') {
            e.preventDefault()
          }
        }}
      >
        {path?.title}
      </Anchor>
    ))

  const [_activeLink, setActiveLink] = useState('/seller')

  const handleSetActiveLink = (link: string) => {
    setActiveLink(link)
  }

  const handleResize = () => {
    dispatch(setIsSmallScreen(window.innerWidth < 768))
  }

  const handleLogout = async () => {
    persistor
      .purge()
      .then(() => persistor.flush())
      .then(() => {
        dispatch(signOutSuccess())
        dispatch(resetUser())
      })

    navigate('/home')
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  return (
    <>
      <AppShell
        bg="primary"
        header={{ height: APPSHELL_HEIGHT }}
        navbar={{
          width: isSmallNav ? SMALL_SCREEN_WIDTH : LARGE_SCREEN_WIDTH,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header className={styles.header}>
          {String(roleId) === '2' && (
            <Group h="100%" classNames={{ root: styles.root }}>
              <Burger
                opened={opened}
                onClick={toggle}
                size="md"
                color="white"
              />
            </Group>
          )}
          <Link to="/home">
            <img src={logo} className={styles.img} />
          </Link>
          <div
            className="flex items-center text-white font-bold gap-x-2 cursor-pointer"
            onClick={handleLogout}
          >
            <span className=" hidden md:block text-lg">Log Out</span>
            <IconLogout color="white" size={24} />
          </div>
        </AppShell.Header>

        {String(roleId) === '2' ? (
          <>
            <AppShell.Navbar className={styles.navBar}>
              <div className={styles.navBarInner}>
                <NavLink
                  to="/seller"
                  className={({ isActive }) =>
                    isActive ? styles.navItemActive : ''
                  }
                  onClick={() => {
                    handleSetActiveLink('/seller')
                    if (opened) toggle()
                  }}
                >
                  <div className={styles.navItem}>
                    <IconDashboard
                      className={styles.navIcon}
                      size={ICON_SIZE}
                    />
                    {(!isSmallNav || isSmallScreen) && (
                      <h3 className={styles.navText}>Dashboard</h3>
                    )}
                  </div>
                </NavLink>

                <NavLink
                  to="/seller-property"
                  className={({ isActive }) =>
                    isActive ? styles.navItemActive : ''
                  }
                  onClick={() => {
                    handleSetActiveLink('/seller-property')
                    if (opened) toggle()
                  }}
                >
                  <div className={styles.navItem}>
                    <IconBuildingSkyscraper
                      className={styles.navIcon}
                      size={ICON_SIZE}
                    />
                    {(!isSmallNav || isSmallScreen) && (
                      <h3 className={styles.navText}>Property</h3>
                    )}
                  </div>
                </NavLink>

                <NavLink
                  to="/seller-profile"
                  className={({ isActive }) =>
                    isActive ? styles.navItemActive : ''
                  }
                  onClick={() => {
                    handleSetActiveLink('/seller-profile')
                    if (opened) toggle()
                  }}
                >
                  <div className={styles.navItem}>
                    <IconUserStar className={styles.navIcon} size={ICON_SIZE} />
                    {(!isSmallNav || isSmallScreen) && (
                      <h3 className={styles.navText}>Profile</h3>
                    )}
                  </div>
                </NavLink>
                <NavLink
                  to="/seller-transaction"
                  className={({ isActive }) =>
                    isActive ? styles.navItemActive : ''
                  }
                  onClick={() => {
                    handleSetActiveLink('/seller-transaction')
                    if (opened) toggle()
                  }}
                >
                  <div className={styles.navItem}>
                    <IconCreditCard
                      className={styles.navIcon}
                      size={ICON_SIZE}
                    />
                    {(!isSmallNav || isSmallScreen) && (
                      <h3 className={styles.navText}>Transaction</h3>
                    )}
                  </div>
                </NavLink>

                <NavLink
                  to="/seller-report"
                  className={({ isActive }) =>
                    isActive ? styles.navItemActive : ''
                  }
                  onClick={() => {
                    handleSetActiveLink('/seller-report')
                    if (opened) toggle()
                  }}
                >
                  <div className={styles.navItem}>
                    <IconGraph className={styles.navIcon} size={ICON_SIZE} />
                    {(!isSmallNav || isSmallScreen) && (
                      <h3 className={styles.navText}>Report</h3>
                    )}
                  </div>
                </NavLink>
              </div>

              <Group>
                <Burger
                  opened={!isSmallNav}
                  onClick={() => {
                    setIsSmallNav((prev) => !prev)
                  }}
                  visibleFrom="sm"
                  size="md"
                />
              </Group>
            </AppShell.Navbar>
            <AppShell.Main className={styles.main}>
              <Breadcrumbs my="md">{paths}</Breadcrumbs>
              <Divider size="xs" />
              <Views />
            </AppShell.Main>
          </>
        ) : (
          <div className="mt-20">
            <Views />
          </div>
        )}
      </AppShell>
    </>
  )
}
