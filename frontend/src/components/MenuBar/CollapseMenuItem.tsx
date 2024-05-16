import React, { useEffect, useState } from 'react'
import styles from './MenuBar.module.scss'
import { Accordion, Menu } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { NavigationTree } from '../../types/navigation'
import { NavLink, useSearchParams } from 'react-router-dom'
import { countAvailableProperties } from '../../service/PropertyService'

interface CollapseMenuItemProps {
  nav: NavigationTree
  isOfDrawers: boolean
  closeDrawer?: () => void
  activeLink: string
}
export default function CollapseMenuItem({
  nav,
  isOfDrawers,
  closeDrawer,
}: CollapseMenuItemProps) {
  const OPEN_DELAY = 50
  const CLOSE_DELAY = 50
  const [searchParams] = useSearchParams()
  const [listOfCategoriesBasedOnFeature, setListOfCategoriesBasedOnFeature] =
    useState<any[]>([])

  const handleGetCountAvailableProperties = async () => {
    const res = await countAvailableProperties()
    setListOfCategoriesBasedOnFeature((_prev) => res.metaData)
  }

  useEffect(() => {
    handleGetCountAvailableProperties()
  }, [])

  return (
    <>
      {isOfDrawers && listOfCategoriesBasedOnFeature ? (
        <Accordion
          variant="unstyled"
          className="w-full"
          classNames={{
            content: 'px-0 py-0',
            chevron:
              'text-white w-[50px] h-[50px] flex justify-center items-center',
            label: 'p-0',
            panel: 'text-black',
          }}
          w="100%"
        >
          <Accordion.Item value="photos" className="hover:bg-transparent">
            <Accordion.Control className="w-full p-0 m-0">
              {/* <NavLink
                to={`/search?featureId=${nav.key}`}
                key={nav.key}
                onClick={closeDrawer}
                className={styles.navLinkCollapse}
              >
                <div className=" flex flex-col justify-center">
                  <h1 className={styles.navText}>{nav.title}</h1>
                </div>
              </NavLink> */}
              <div key={nav.key}>
                <div className=" flex flex-col justify-center">
                  <h1 className={styles.navText}>{nav.title}</h1>
                </div>
              </div>
            </Accordion.Control>
            <Accordion.Panel className="mx-[-42px] mt-2 bg-[#2c513f] rounded-lg shadow-xl">
              <div className=" flex flex-col px-[9px] justify-center ">
                {listOfCategoriesBasedOnFeature.length > 0 &&
                  listOfCategoriesBasedOnFeature
                    .filter((el: any) => String(el.featureId) === nav.key)[0]
                    .categories.filter((el: any) => el.count > 0)
                    .map((category: any) => (
                      <NavLink
                        className=" py-4 px-8 rounded-md hover:bg-[#518B76] flex items-center"
                        key={category.categoryId}
                        to={`/search?featureId=${nav.key}&categoryId=${category.categoryId.toString()}`}
                      >
                        <span
                          className="font-semibold text-white"
                          onClick={() => {
                            closeDrawer
                          }}
                        >
                          {category.name}
                        </span>
                      </NavLink>
                    ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ) : (
        <Menu
          trigger="hover"
          openDelay={OPEN_DELAY}
          closeDelay={CLOSE_DELAY}
          width={170}
          position={isOfDrawers ? 'right-start' : 'bottom'}
          withArrow
          transitionProps={{
            transition: 'pop',
            duration: 300,
            timingFunction: 'ease-in-out',
            exitDuration: 100,
          }}
        >
          <Menu.Target>
            <NavLink
              to={`/search?featureId=${nav.key}`}
              key={nav.key}
              className={styles.navLink}
              onClick={closeDrawer}
            >
              <div className=" flex flex-col justify-center">
                <h1 className={styles.navText}>
                  {nav.title}
                  <IconChevronDown className={styles.icon} />
                </h1>
                <span
                  className={`h-[3px] mt-2 bg-[#ffa500] ${searchParams.get('featureId') && searchParams.get('featureId') === nav.key ? 'opacity-100' : 'opacity-0'}`}
                ></span>
              </div>
            </NavLink>
          </Menu.Target>
          <Menu.Dropdown>
            {listOfCategoriesBasedOnFeature.length > 0 &&
              listOfCategoriesBasedOnFeature
                .filter((el: any) => String(el.featureId) === nav.key)[0]
                .categories.filter((el: any) => el.count > 0)
                .map((category: any) => (
                  <NavLink
                    key={category.categoryId}
                    to={`/search?featureId=${nav.key}&categoryId=${category.categoryId.toString()}`}
                  >
                    <Menu.Item
                      className={styles.dropdown}
                      onClick={() => {
                        closeDrawer
                      }}
                    >
                      {category.name}
                    </Menu.Item>
                  </NavLink>
                ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  )
}
