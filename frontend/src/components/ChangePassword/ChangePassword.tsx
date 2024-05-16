import React, { useState } from 'react'
import { Button, PasswordInput, Stack, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Swal from 'sweetalert2'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import { changePassword } from '../../service/ProfileService'
import styles from './ChangePassword.module.scss'
import UnderMaintenance from '../UnderMaintenance/UnderMaintenance'

interface ChangePasswordProps {
  isOpened: boolean
  onClose: () => void
}
interface FormValues {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export default function ChangePassword({
  isOpened,
  onClose,
}: ChangePasswordProps) {
  const [visible, { toggle }] = useDisclosure(false)
  const [visibleCurrentPw, handlers] = useDisclosure(false)
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .matches(
        /^(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least 1 number and 1 character',
      )
      .min(8)
      .required('Current Password is required'),
    newPassword: yup
      .string()
      .matches(
        /^(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least 1 number and 1 character',
      )
      .min(8)
      .test(
        'not-same-as-current',
        'New password cannot be the same as the current password.',
        function (value) {
          return this.parent.currentPassword !== value
        },
      )
      .required('New Password is required'),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Confirm Password must match')
      .required('Password Confirmation is required'),
  })
  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: yupResolver(passwordSchema),
  })

  const handleToggleCurrentPassword = (prop: boolean) => {
    prop ? handlers.open() : handlers.close()
  }

  const handleChangePassword = async (values: FormValues) => {
    passwordForm.clearErrors()
    const { currentPassword, newPassword } = values
    try {
      setIsLoading(true)
      await changePassword({ currentPassword, newPassword })
      onClose()
      passwordForm.reset()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Password has been changed successfully!',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error: any) {
      passwordForm.setErrors({
        currentPassword: error.response.data.error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal
        opened={isOpened}
        onClose={() => {
          passwordForm.reset()
          onClose()
        }}
        centered
        title="Change Password"
        classNames={{ title: styles.pwTitle }}
      >
        <form
          onSubmit={passwordForm.onSubmit((values) =>
            handleChangePassword(values),
          )}
        >
          <Stack>
            <PasswordInput
              {...passwordForm.getInputProps('currentPassword')}
              size="md"
              label="Current Password"
              placeholder="Current Password"
              visible={visibleCurrentPw}
              onVisibilityChange={() =>
                handleToggleCurrentPassword(!visibleCurrentPw)
              }
              onChange={(event) =>
                passwordForm.setFieldValue(
                  'currentPassword',
                  event.currentTarget.value,
                )
              }
            />
            <PasswordInput
              {...passwordForm.getInputProps('newPassword')}
              size="md"
              label="New Password"
              placeholder="New Password"
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(event) =>
                passwordForm.setFieldValue(
                  'newPassword',
                  event.currentTarget.value,
                )
              }
            />
            <PasswordInput
              {...passwordForm.getInputProps('confirmNewPassword')}
              size="md"
              label="Confirm Password"
              placeholder="Confirm Password"
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(event) =>
                passwordForm.setFieldValue(
                  'confirmNewPassword',
                  event.currentTarget.value,
                )
              }
            />
            <div>
              <div className=" flex justify-center">
                <Button
                  size="md"
                  type="submit"
                  className={styles.btn}
                  loading={isLoading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Stack>
        </form>
      </Modal>
      <UnderMaintenance
        setStatus={setIsUnderMaintenance}
        status={isUnderMaintenance}
      />
    </>
  )
}
