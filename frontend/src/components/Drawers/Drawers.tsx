import React from 'react'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { Drawer, Button } from '@mantine/core'
import MenuBar from '../MenuBar/MenuBar'
import { FaAlignJustify } from 'react-icons/fa'
import styles from './Drawers.module.scss'
import logo from '../../assets/images/logo_transparent.png'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

export default function Drawers() {
  const [opened, { open, close }] = useDisclosure(false)
  const userAuthority = useAppSelector((state) => state.user.roleId)
  const { width } = useViewportSize()

  const getSizePercentage = () => {
    if (width >= 900) {
      return '45%'
    } else if (width >= 600) {
      return '50%'
    } else {
      return '80%'
    }
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        className={styles.drawers}
        size={getSizePercentage()}
        classNames={{
          root: '',
          body: ' bg-primary w-full h-full overflow-y-scroll overflow-x-hidden my-0 p-0',
          header: 'bg-primary px-0 w-full px-3',
          close: ' text-white font-bold hover:bg-transparent',
        }}
        withCloseButton={false}
      >
        <Drawer.Header>
          <Drawer.Title>
            <div className="flex items-center">
              <Link to="/home" onClick={close}>
                <img src={logo} className={styles.logo} />
              </Link>
            </div>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <MenuBar
          isOfDrawers={true}
          closeDrawer={close}
          userAuthority={userAuthority!}
        />
      </Drawer>

      <Button onClick={open} classNames={{ root: styles.toggleBtn }}>
        <FaAlignJustify className={styles.iconAlign} />
      </Button>
    </>
  )
}
