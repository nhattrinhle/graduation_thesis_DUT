import React, { useEffect, useState } from 'react'
import styles from './MaintenanceComponent.module.scss'
import { Box, LoadingOverlay, Switch, Textarea, Tooltip } from '@mantine/core'
import {
  IconSettingsAutomation,
  IconSettingsCog,
  IconSettingsPause,
} from '@tabler/icons-react'
import Swal from 'sweetalert2'
import {
  getMaintenanceMode,
  updateMaintenanceMode,
} from '../../service/MaintenanceService'
import { cancelBtn, confirmBtn } from '../../constants/color.constant'

export default function MaintenanceComponent() {
  const [checked, setChecked] = useState<boolean | undefined>()
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const handleGetMaintenanceMode = async () => {
    try {
      setVisible((_prev) => true)
      const res = await getMaintenanceMode()
      setChecked((_prev) => res.metaData.isMaintenance)
      if (res.metaData.isMaintenance === true) {
        setMessage((_prev) => res.metaData.description)
      } else {
        // if it's not under maintenance, then set this default message
        setMessage((_prev) => 'This website is under maintenance mode.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setVisible((_prev) => false)
    }
  }

  const handleUpdateMaintenanceMode = async (
    status: boolean,
    message: string,
  ) => {
    try {
      await updateMaintenanceMode(status, message)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleGetMaintenanceMode()
  }, [checked])

  const handleToggle = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Maintenance Mode Confirmation',
      text: `Are you sure you want to turn ${checked ? 'OFF' : 'ON'} maintenance mode?`,
      showCancelButton: true,
      confirmButtonColor: confirmBtn,
      cancelButtonColor: cancelBtn,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setVisible((_prev) => true)
        try {
          await handleUpdateMaintenanceMode(
            !checked,
            message ? message : 'This website is under maintenance mode.',
          )
          setChecked((prev) => !prev)
          Swal.fire({
            icon: 'success',
            title: `Maintenance Mode Turned ${checked ? 'OFF' : 'ON'} Successfully!`,
            text: `${checked ? 'Maintenance mode has been turned off for your website.' : 'Your website is on maintenance mode now.'}`,
            confirmButtonColor: confirmBtn,
          })
        } catch (error) {
          console.error(error)
        } finally {
          setVisible((_prev) => false)
        }
      }
    })
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Admin Maintenance{' '}
          <IconSettingsCog
            size={30}
            stroke={2}
            className="text-primary ml-5"
          ></IconSettingsCog>
        </h1>
        <Box pos="relative">
          <LoadingOverlay
            visible={visible}
            zIndex={10}
            overlayProps={{ radius: 'sm', blur: 5 }}
            loaderProps={{ color: 'pink', type: 'bars' }}
          />
          <div>
            <p>
              This functionality allows you to put the website into maintenance
              mode. While in maintenance mode, users will be unable to access
              certain features of the website.
            </p>
            <h2>What does maintenance mode do?</h2>
            <p>
              While the website is in maintenance mode, the following features
              will be unavailable to users:
              <ul className=" flex flex-col gap-y-3">
                <li>
                  <strong>Contact Forms:</strong> Users can still be able to
                  submit contact forms.
                </li>
                <li>
                  <strong>Property Search:</strong> Users can still be able to
                  search for properties and see details about them.
                </li>
                <li>
                  <strong>Property Favorites:</strong> Users may not be able to
                  favorite or unfavorite properties.
                </li>
                <li>
                  <strong>Property Listings:</strong> New property listings may
                  not be allowed during maintenance.
                </li>
                <li>
                  <strong>User Account Access:</strong> Users may not be able to
                  access their accounts or update their information.
                </li>
                <li>
                  <strong>Public Paths:</strong> Users can still be able to have
                  access to public paths that do not require any database
                  adjustment.
                </li>
              </ul>
            </p>
            <h2>How to use this functionality?</h2>
            <ul className="flex flex-col gap-y-3">
              <li>
                If you want to customize the maintenance mode message, please
                enter your message in the text area provided below. If no
                message is provided, the default message will be used.
              </li>
              <li>
                To enable or disable maintenance mode, simply toggle the
                switcher above. Please note that changes may take a few minutes
                to take effect.
              </li>
            </ul>

            <Textarea
              className="mb-5 text-primary"
              size="md"
              label="Enter Message For Maintenance Pop-Up"
              value={message}
              autosize
              minRows={5}
              maxRows={7}
              onChange={(event) => setMessage(event.currentTarget.value)}
            />
            <div className="flex items-center gap-x-5">
              <h3 className="mb-5 font-extrabold">
                Maintenance Mode Switcher:
              </h3>

              <Switch
                classNames={{
                  track: `${checked ? 'bg-[#5FA084]' : 'bg-blur'}  outline-none border-none`,
                }}
                width={150}
                size="xl"
                checked={checked}
                onChange={handleToggle}
                onLabel={
                  <Tooltip label="Turn Off Maintenance Mode">
                    <IconSettingsPause stroke={2} />
                  </Tooltip>
                }
                offLabel={
                  <Tooltip label="Turn On Maintenance Mode">
                    <IconSettingsAutomation stroke={2} />
                  </Tooltip>
                }
              />
              <h3 className="mb-5 font-extrabold">{checked ? 'ON' : 'OFF'}</h3>
            </div>
          </div>
        </Box>
      </div>
    </>
  )
}
