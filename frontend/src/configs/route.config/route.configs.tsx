import { lazy } from 'react'
import { Roles } from '../../types/role'

export const publicRoutes = [
  {
    key: 'home',
    path: `/home`,
    component: lazy(() => import('../../pages/HomePage/HomePage')),
    authority: [],
  },
  {
    key: 'details',
    path: `/details/:id`,
    component: lazy(() => import('../../pages/DetailPage/DetailPage')),
    authority: [],
  },
  {
    key: 'search',
    path: `/search`,
    component: lazy(() => import('../../pages/SearchPage/SearchPage')),
    authority: [],
  },
  {
    key: 'for-sale',
    path: `/for-sale`,
    component: lazy(() => import('../../pages/SearchPage/SearchPage')),
    authority: [],
  },
  {
    key: 'for-rent',
    path: `/for-rent`,
    component: lazy(() => import('../../pages/SearchPage/SearchPage')),
    authority: [],
  },
  {
    key: 'feedback',
    path: `/feedback`,
    component: lazy(() => import('../../pages/FeedbackPage/FeedbackPage')),
    authority: [],
  },
  {
    key: 'about-us',
    path: '/about-us',
    component: lazy(() => import('../../pages/AboutUsPage/AboutUsPage')),
    authority: [],
  },
]

export const protectedRoutes = [
  {
    key: 'profile',
    path: '/seller-profile',
    component: lazy(() => import('../../components/Profile/UserProfile')),
    authority: [Roles.Seller],
  },
  {
    key: 'seller-dashboard',
    path: '/seller',
    component: lazy(
      () => import('../../pages/SellerDashboardPage/SellerDashboardPage'),
    ),
    authority: [Roles.Seller],
  },
  {
    key: 'seller-property',
    path: '/seller-property',
    component: lazy(() => import('../../pages/SellerPage/SellerPage')),
    authority: [Roles.Seller],
  },
  {
    key: 'transaction',
    path: '/transaction',
    component: lazy(
      () => import('../../components/Transaction/TransactionComponent'),
    ),
    authority: [Roles.Seller],
  },
  {
    key: 'seller-transaction-history',
    path: '/seller-transaction',
    component: lazy(
      () =>
        import('../../pages/SellerTransactionHistory/SellerTransactionHistory'),
    ),
    authority: [Roles.Seller],
  },
  {
    key: 'seller-report',
    path: '/seller-report',
    component: lazy(
      () => import('../../pages/SellerReportPage/SellerReportPage'),
    ),
    authority: [Roles.Seller],
  },
  {
    key: 'admin-dashboard',
    path: '/admin',
    component: lazy(
      () => import('../../pages/AdminDashboardPage/AdminDashboardPage'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-property',
    path: '/admin-property',
    component: lazy(
      () => import('../../pages/AdminPropertyPage/AdminPropertyPage'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-user',
    path: '/admin-user',
    component: lazy(
      () => import('../../pages/AdminManageUserPage/AdminManageUserPage'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-transaction',
    path: '/admin-transaction',
    component: lazy(
      () => import('../../pages/AdminTransactionPage/AdminTransactionPage'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-transaction',
    path: '/admin-conversion-rate',
    component: lazy(
      () => import('../../components/ConversionRate/ConversionRateComponent'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-report',
    path: '/admin-report',
    component: lazy(
      () => import('../../pages/AdminReportPage/AdminReportPage'),
    ),
    authority: [Roles.Admin],
  },
  {
    key: 'admin-maintenance',
    path: '/admin-maintenance',
    component: lazy(
      () => import('../../components/Maintenance/MaintenanceComponent'),
    ),
    authority: [Roles.Admin],
  },
]

export const authRoutes = [
  {
    key: 'login',
    path: `/login`,
    component: lazy(() =>
      import('../../components/Login/Login').then((module) => ({
        default: module.Login,
      })),
    ),
    authority: [],
  },
  {
    key: 'register',
    path: `/register`,
    component: lazy(() => import('../../components/Register/Register')),
    authority: [],
  },
]
