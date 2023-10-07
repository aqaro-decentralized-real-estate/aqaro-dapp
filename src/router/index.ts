import { createRouter, createWebHistory } from 'vue-router'

import DaoIndex from '../views/dao/index.vue'
import NotFoundComponent from '../views/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/just-shipped',
      name: 'just.shipped',
      component: () => import('../views/JustShippedView.vue'),
    },
    {
      path: '/early-investor',
      name: 'early.investor',
      component: () => import('../views/invest/early.investment.vue'),
    },
    // {
    //   path: '/presale',
    //   name: 'invest.presale',
    //   component: () => import('../views/invest/presale.token.vue'),
    // },
    {
      path: '/stake',
      name: 'stake',
      component: () => import('../views/invest/stake.token.vue'),
    },
    {
      path: '/properties/all',
      name: 'property.overview',
      component: () => import('../views/properties/overview.property.vue'),
    },
    {
      path: '/properties/create',
      name: 'property.create',
      component: () => import('../views/properties/form.property.vue'),
    },
    {
      path: '/property/:address',
      name: 'property.detail',
      component: () => import('../views/properties/show.property.vue'),
    },
    {
      path: '/mortgage/provider',
      name: 'mortgage.liquidity.provider',
      component: () => import('../views/mortgage/liquidity.provider.mortgage.vue'),
    },
    {
      path: '/mortgage/request/:address',
      name: 'mortgage.property.request',
      component: () => import('../views/mortgage/request.property.mortgage.vue'),
    },
    {
      path: '/dao',
      component: DaoIndex,
      meta: {
        isAuthenticated: true,
      },
      children: [
        {
          path: '/dao/dashboard',
          name: 'dao.dashboard',
          component: () => import('../views/dao/dashboard.vue'),
          meta: {
            isAuthenticated: true,
          },
        },
        {
          path: '/dao/mortgage',
          name: 'dao.mortgage',
          children: [
            {
              path: '',
              name: 'dao.mortgage.overview',
              component: () => import('../views/dao/mortgages/overview.mortgage.vue'),
            },
            {
              path: 'request/:address',
              name: 'dao.mortgage.request.detail',
              component: () => import('../views/dao/mortgages/show.mortgage.vue'),
            }
          ]
        },
        {
          path: '/dao/proposal',
          name: 'dao.proposal',
          children: [
            {
              path: '',
              name: 'dao.proposal.overview',
              component: () => import('../views/dao/proposals/overview.proposal.vue'),
            },
            {
              path: 'create',
              name: 'dao.proposal.create',
              component: () => import('../views/dao/proposals/form.proposal.vue'),
            },
            {
                path: ':id',
                name: 'dao.proposal.detail',
                component: () => import('../views/dao/proposals/show.proposal.vue'),
            }
          ]
        }
      ],
    },
    {
      path: '/:catchAll(.*)',
      component: NotFoundComponent,
      name: 'NotFound'
    }
  ]
})

export default router
