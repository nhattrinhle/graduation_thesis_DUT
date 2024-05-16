import React, { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Stack,
  Anchor,
  Text,
  Divider,
} from '@mantine/core'
import style from './Login.module.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GoogleButton } from './GoogleButton'
import axios from 'axios'
import { setUser } from '../../redux/reducers/userSlice'
import { signInSuccess } from '../../redux/reducers/sessionSlice'
import { useAppDispatch } from '../../redux/hooks'
import appConfig from '../../configs/app.config'
import { useGoogleLogin } from '@react-oauth/google'
import { Roles } from '../../types/role'
import Swal from 'sweetalert2'

const LOGIN_URL = '/user/login'
interface Props {
  email: string
  password: string
}
const rolePaths: Record<Roles, string> = {
  [Roles.User]: appConfig.tourPath,
  [Roles.Admin]: appConfig.adminEntryPath,
  [Roles.Seller]: appConfig.authenticatedEntryPath,
}
export function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [userGoogle, setUserGoogle] = useState<string | null>(null)
  const location = useLocation()
  const [flag, setFlag] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (location.state && location.state.message && !flag) {
    Swal.fire({
      icon: 'success',
      title: 'Upgrade to seller successfully! ',
      text: location.state.message,
    })
    window.history.replaceState({}, '') // to make sure the message is not shown again
    setFlag((_prev) => true)
  }

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUserGoogle(response.access_token)
    },
  })

  useEffect(() => {
    if (userGoogle) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGoogle}`,
          {
            headers: {
              Authorization: `Bearer ${userGoogle}`,
              Accept: 'application/json',
            },
          },
        )
        .then(async (res) => {
          try {
            const userServer = await axios.post(`/user/login-with-google`, {
              email: res.data.email,
              fullName: res.data.name,
              accessToken: userGoogle,
            })
            await dispatch(setUser(userServer.data.metaData.userInfo))
            await dispatch(
              signInSuccess({
                signedIn: true,
                tokens: { ...userServer.data.metaData.tokens },
              }),
            )
            const roleId = userServer.data.metaData.userInfo.roleId

            if (roleId === Roles.User) {
              navigate(appConfig.tourPath)
            }
            if (roleId === Roles.Seller) {
              navigate(appConfig.authenticatedEntryPath)
            }
          } catch (error: any) {
            setError(error.response.data.error.message)
          }
        })
    }
  }, [userGoogle])

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 8 ? 'Password should include at least 8 characters' : null,
    },
  })

  const handleLogin = async (value: Props) => {
    setError('')
    try {
      setIsLoading(true)
      const res = await axios.post(
        LOGIN_URL,
        { email: value.email, password: value.password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      const roleId: Roles = res.data.metaData.user.roleId
      if (
        res.data.metaData.user.isEmailVerified === false &&
        Number(roleId) !== Roles.User
      ) {
        setError((_prev) => 'Please verify email before login')
        return
      }
      if (res.data.metaData.user.isActive === false) {
        setError(
          (_prev) =>
            'Your account has been deactivated. We apologize for any inconvenience.',
        )
        return
      }
      // if not meet any of these 2 conditions above then user can login

      const rolePath = rolePaths[roleId]

      await dispatch(setUser(res.data.metaData.user))
      await dispatch(
        signInSuccess({
          signedIn: true,
          tokens: { ...res.data.metaData.tokens },
        }),
      )
      navigate(rolePath)
    } catch (error: any) {
      setError(error.response.data.error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Text className="text-center" size="lg" fw={500}>
        Welcome to{' '}
        <Link to="/home">
          <span className="font-[700] text-archivo text-[#399f83]">
            Modern House
          </span>
        </Link>
        . Log In with email
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          handleLogin(values)
        })}
      >
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="Enter email"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Enter password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
            radius="md"
          />
          {error && <div className="text-red">{error}</div>}
        </Stack>

        <Button
          loading={isLoading}
          size="md"
          type="submit"
          radius="xl"
          classNames={{ root: style.btnLogIn }}
        >
          Log In
        </Button>
        <Group justify="space-between" mt="xl">
          <Anchor>
            <Link to="/register">Do not have an account? Register</Link>
          </Anchor>
        </Group>
      </form>
      <Divider
        label="Or continue with "
        labelPosition="center"
        my="lg"
        classNames={{ label: style.divider }}
      />
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={() => login()}>
          Google
        </GoogleButton>
      </Group>
    </>
  )
}
