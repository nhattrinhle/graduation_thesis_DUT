import React, { ComponentType } from 'react'

export type AppRouteProps<T> = {
  component: ComponentType<T>
  routeKey?: string
}

const AppRoute = <T extends Record<string, unknown>>({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps<T>) => {
  return <Component key={routeKey} {...(props as T)} />
}

export default AppRoute
