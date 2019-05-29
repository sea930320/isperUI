import VueRouter from 'vue-router'
import Vue from 'vue'
import VueCookie from 'vue-cookie'

import store from './store'
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
}, {
    path: 'message-view',
    component: () => import('@/views/personal-center/MessageView.vue')
}];

const systemSetRoutes = [{
    path: 'system-set',
    name: 'system-set',
    component: () => import('@/views/system-set/SystemSet.vue')
}];

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
    path: '/advertisings',
    name: 'advertisings',
    component: () => import('@/views/system-set/advertising/AdvertisingList.vue')
},
{
    path: '/advertising/:Pid',
    name: 'advertising',
    component: () => import('@/views/system-set/advertising/AdvertisingDetail.vue')
},
{
    path: '/manager', // 管理员主页
    meta: {
        requiresAuth: true
    },
    component: () => import('@/views/layout/Manager.vue'),
    children: [
        ...personalCenterRoutes,
        ...systemSetRoutes,
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
        {
            path: 'workflow/set/:flow_id',
            component: () => import('@/views/manager/workflow/SettingsBase.vue'),
            meta: {
                step: true
            },
            children: [
                {
                    path: '',
                    redirect: '0',
                },
                {
                    path: '0',
                    name: 'setworkflow-node',
                    component: () => import('@/views/manager/workflow/NodeSettings.vue'),
                    beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 0)
                },
                {
                    path: '1',
                    name: 'setworkflow-doc',
                    component: () => import('@/views/manager/workflow/DocSettings.vue'),
                    beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 1)
                },
                {
                    path: '2',
                    name: 'setworkflow-role',
                    component: () => import('@/views/manager/workflow/RoleSettings.vue'),
                    beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 2)
                },
                {
                    path: '3',
                    name: 'setworkflow-module',
                    component: () => import('@/views/manager/workflow/ModuleSettings.vue'),
                    beforeEnter: (to, from, next) => flowSetEnter(to, from, next, 3)
                }
            ]
        }, {
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
        }, {
            path: 'user/:id',
            name: 'super-user-manage',
            component: () => import('@/views/manager/user/UMIndex.vue')
        }, {
            path: 'module_manage',
            name: 'super-module-manage',
            component: () => import('@/views/manager/module_manage/ModuleIndex.vue')
        }
    ]
},
{
    path: '/business',
    meta: {
        requiresAuth: true
    },
    component: () => import('@/views/layout/Business.vue'),
    children: [
        ...personalCenterRoutes,
        {
            path: '',
            redirect: 'search'
        }, {
            path: 'search',
            component: () => import('@/views/business/search/SearchIndex.vue'),
            children: [
                {
                    path: '',
                    redirect: 'filter-method',
                },
                {
                    path: 'filter-method',
                    name: 'business-search-filter-method',
                    component: () => import('@/views/business/search/FilterMethod.vue')
                },
                {
                    path: 'search1/:by',
                    name: 'business-search-by-company-and-office',
                    component: () => import('@/views/business/search/Search1.vue')
                },
                {
                    path: 'search2',
                    name: 'business-search-by-keyword',
                    component: () => import('@/views/business/search/Search2.vue')
                },
            ]
        }
    ]
}
];

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
});

// 流程设置跳转判断
const flowSetEnter = (to, from, next, page) => {
    if (to.matched.some(record => record.meta.step)) {
        if (store.state.flowStep > -1 && store.state.flowStep >= page) {
            next()
        } else if (!store.state.flowStep && store.state.flowStep !== 0) {
            Vue.toasted.error('参数错误');
            next({
                path: `/manager/workflow`,
                query: { redirect: to.fullPath }
            })
        } else {
            Vue.toasted.error('当前环节数据未设置完整，不能跳转到下一步');
            next({
                path: `/manager/workflow/set/${to.params.flow_id}/${store.state.flowStep}`,
                query: { redirect: to.fullPath }
            })
        }
    } else {
        next()
    }
};

export default router