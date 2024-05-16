import React, { Suspense } from 'react'
import {
  authRoutes,
  protectedRoutes,
  publicRoutes,
} from '../configs/route.config/route.configs'
import appConfig from '../configs/app.config'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import AppRoute from '../routes/AppRoute'
import ProtectedRoute from '../routes/ProtectedRoute'
import PublicRoute from '../routes/PublicRoute'
import AuthorityGuard from '../routes/AuthorityGuard'
import { Skeleton } from '@mantine/core'
import '@mantine/core/styles.css'
import Unauthorized from '../components/Unauthorized/Unauthorize'

const { tourPath } = appConfig

const AllRoutes = () => {
  const userAuthority = useAppSelector((state) => state.user.roleId)

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to={tourPath} />} />
        <Route path="/" element={<PublicRoute></PublicRoute>}>
          {publicRoutes.map((route) => (
            <Route
              key={route.key}
              path={route.path}
              element={
                <AppRoute routeKey={route.key} component={route.component} />
              }
            />
          ))}
        </Route>

        <Route path="/" element={<ProtectedRoute></ProtectedRoute>}>
          {protectedRoutes.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <AppRoute routeKey={route.key} component={route.component} />
                </AuthorityGuard>
              }
            />
          ))}
        </Route>
        <Route>
          {authRoutes.map((route) => (
            <Route
              key={route.key}
              path={route.path}
              element={
                userAuthority ? (
                  <Navigate to="/home" />
                ) : (
                  <AppRoute routeKey={route.key} component={route.component} />
                )
              }
            />
          ))}
        </Route>

        <Route path="/access-denied" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  )
}

const SkeletonBlock = () => {
  return (
    <>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="100%" radius="xl" />
    </>
  )
}

const Views = () => {
  return (
    <Suspense fallback={<SkeletonBlock />}>
      <AllRoutes />
    </Suspense>
  )
}

export default Views
