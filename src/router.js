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
    path: '/surveys',
    name: 'surveys',
    component: () => import('@/views/survey/SurveyList.vue')
},
{
    path: '/survey/:id',
    name: 'survey_qa',
    component: () => import('@/views/survey/TakeSurvey.vue')
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
            path: 'course',
            name: 'course-manage',
            component: () => import('@/views/manager/course/CourseIndex.vue')
        }, {
            path: 'module_manage',
            name: 'super-module-manage',
            component: () => import('@/views/manager/module_manage/ModuleIndex.vue')
        }, {
            path: 'business',
            name: 'business-manager',
            component: () => import('@/views/manager/business/BusinessIndex.vue')
        }, {
            path: '/moreTeammates',
            name: 'manager-moreTeammates',
            component: () => import('@/views/personal-center/MoreTeammates.vue')
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
            redirect: 'prepare'
        }, {
            path: 'prepare',
            component: () => import('@/views/business/prepare/PrepareIndex.vue'),
            children: [
                {
                    path: '',
                    redirect: 'filter-method',
                },
                {
                    path: 'filter-method',
                    name: 'business-prepare-filter-method',
                    component: () => import('@/views/business/prepare/FilterMethod.vue')
                },
                {
                    path: 'prepare1/:by',
                    name: 'business-prepare-by-company-and-office',
                    component: () => import('@/views/business/prepare/Prepare1.vue')
                },
                {
                    path: 'prepare2',
                    name: 'business-prepare-by-keyword',
                    component: () => import('@/views/business/prepare/Prepare1.vue')
                },
                {
                    path: 'post/:id',
                    name: 'business-post',
                    component: () => import('@/views/business/prepare/Post.vue')
                }
            ]
        }, {
            path: 'list/progress',
            component: () => import('@/views/business/list/ProgressListIndex.vue')
        }, {
            path: 'list/done',
            component: () => import('@/views/business/list/DoneListIndex.vue')
        }, {
            path: '/done/detail/:bid',
            name: 'done-detail',
            component: () => import('@/views/business/done/Detail.vue')
        }, {
            path: '/business/detail/:bid',
            name: 'business-detail',
            component: () => import('@/views/business/Detail.vue')
        }, {
            path: 'progress',
            component: () => import('@/views/business/progress/ProgressIndex.vue'),
            children: [
                { path: '1/:bid/:nid', name: 'animation', component: () => import('@/views/business/progress/animation/AnimationIndex.vue') },
                { path: '2/:bid/:nid', name: 'edit', component: () => import('@/views/business/progress/edit/EditIndex.vue') },        //编辑
                { path: '3/:bid/:nid', name: 'display', component: () => import('@/views/business/progress/display/DisplayIndex.vue') },  //展示
                { path: '4/:bid/:nid', name: 'report', component: () => import('@/views/business/progress/report/ReportIndex.vue') },
                { path: '5/:bid/:nid', name: 'poll', component: () => import('@/views/business/progress/poll/PollIndex.vue') },
                { path: '7/:bid/:nid', name: 'post', component: () => import('@/views/business/progress/post/PostIndex.vue') }, // 公示
                { path: '8/:bid/:nid', name: 'vote', component: () => import('@/views/business/progress/vote/VoteIndex.vue') },
                { path: '9/:bid/:nid', name: 'nest', component: () => import('@/views/business/progress/nest/NestIndex.vue') },
                { path: '10/:bid/:nid', name: 'distribute_sign', component: () => import('@/views/business/progress/distribute_sign/DistributeIndex.vue') },  //展示
                { path: '11/:bid/:nid', name: 'qa', component: () => import('@/views/business/progress/qa/QAIndex.vue') },  // 调查问卷
                { path: '12/:bid/:nid', name: 'select_decide', component: () => import('@/views/business/progress/select_decide/SelectDecideIndex.vue') },
                { path: 'wait/:bid/:nid', name: 'wait', component: () => import('@/views/business/progress/wait/WaitIndex.vue') }
            ]
        }, {
            path: '/moreTeammates',
            name: 'business-moreTeammates',
            component: () => import('@/views/personal-center/MoreTeammates.vue')
        }
    ]
},
{
    path: '/student',
    meta: {
        requiresAuth: true
    },
    component: () => import('@/views/layout/Student.vue'),
    children: [
        ...personalCenterRoutes,
        {
            path: '',
            redirect: 'business-watch'
        }, {
            path: 'business-watch',
            name: 'student-watch',
            component: () => import('@/views/student/watch/WatchIndex.vue')
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
