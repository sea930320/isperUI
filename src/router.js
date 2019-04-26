import VueRouter from 'vue-router'
import Vue from 'vue'
import VueCookie from 'vue-cookie'

// import store from './store'
import {
    STORAGE_KEY_USER
} from './store/storageKey'

Vue.use(VueRouter);

const personalCenterRoutes = [{
    path: 'personal-info',
    component: () => import('@/views/personal-center/PersonalInfo.vue')
}, {
    path: 'password-reset',
    component: () => import('@/views/personal-center/PasswordReset.vue')
}, {
    path: 'assistant-set',
    component: () => import('@/views/personal-center/AssistantSet.vue')
}]

const routes = [{
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/manager', // 管理员主页
        meta: {
            requiresAuth: true
        },
        component: () => import('@/views/layout/Manager.vue'),
        children: [
            ...personalCenterRoutes,
            {
                path: '',
                redirect: 'workflow'
            }, {
                path: 'workflow',
                name: 'manager-workflow',
                component: () => import('@/views/manager/workflow/WorkflowIndex.vue')
            },
            {
                path: '/workflow/draw/:flow_id',
                name: 'manager-workflow-drawXML',
                component: () => import('@/components/workflowXML/drawXML.vue')
            },
            // {
            //     path: 'workflow/set/:flow_id',
            //     name: 'setworkflow',
            //     component: resolve => require(['pages/manager/workflow/settings-base.vue'], resolve),
            //     meta: {
            //         step: true
            //     },
            //     children: [{
            //             path: '',
            //             component: resolve => require(['pages/manager/workflow/node-settings.vue'], resolve)
            //         },
            //         {
            //             path: '0',
            //             name: 'setworkflowNode',
            //             component: resolve => require(['pages/manager/workflow/node-settings.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 0)
            //         },
            //         {
            //             path: '1',
            //             name: 'setworkflowDoc',
            //             component: resolve => require(['pages/manager/workflow/doc-settings.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 1)
            //         },
            //         {
            //             path: '2',
            //             name: 'setworkflowRoleAppend',
            //             component: resolve => require(['pages/manager/workflow/role-append.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 2)
            //         },
            //         {
            //             path: '3',
            //             name: 'setworkflowRoleAssign',
            //             component: resolve => require(['pages/manager/workflow/role-assign.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 3)
            //         },
            //         {
            //             path: '4',
            //             name: 'setworkflowAction',
            //             component: resolve => require(['pages/manager/workflow/action-settings.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 4)
            //         },
            //         {
            //             path: '5',
            //             name: 'setworkflowAnime',
            //             component: resolve => require(['pages/manager/workflow/anime-settings.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 5)
            //         },
            //         {
            //             path: '6',
            //             name: 'setworkflowRole',
            //             component: resolve => require(['pages/manager/workflow/role-settings.vue'], resolve),
            //             beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 6)
            //         }
            //     ]
            // },
            {
                path: 'project',
                name: 'manager-project',
                component: () => import('@/views/manager/project/ProjectIndex.vue')
            }, {
                path: 'project/create_project_wizard',
                name: 'create-project-wizard',
                component: () => import('@/views/manager/project/CreateProjectWizard.vue')
            }, {
                path: 'group',
                name: 'manager-group',
                component: () => import('@/views/manager/group/GroupIndex.vue')
            }, {
                path: 'group_company',
                name: 'manager-group_company',
                component: () => import('@/views/manager/group_company/Group_Company_Index.vue')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes,
    base: process.env.BASE_URL,
    linkActiveClass: 'active'
});

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (VueCookie.get(STORAGE_KEY_USER)) {
            next()
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        next()
    }
})

export default router