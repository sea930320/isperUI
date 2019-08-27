import {
	SHOW_LOADING,
	HIDE_LOADING,
	LOGIN_SUCCESS,
	SET_PERMISSION,
	LOGOUT_SUCCESS,
	SET_FLOW_STEP,
	SEND_EXPERIENCE,
	SEND_MESSAGE_SUCCESS,
	DISPATCH_FLASH_ACTION,
	EMPTY_ACTION_CMD,
	START_ROLE_BANNED,
	UPDATE_VOTE_STATUS,
	UPDATE_USER_ROLE_ALLOCS,
	QUERY_VOTE_STATUS_SUCCESS,
	GET_BUSINESS_NODE_MESSAGES_SUCCESS,
	GET_BUSINESS_DETAIL_SUCCESS,
	GET_BUSINESS_NODE_DETAIL_SUCCESS,
	GET_BUSINESS_NODE_DOCS_SUCCESS,
	GET_BUSINESS_NODE_FUNCTION_SUCCESS,
	GET_BUSINESS_EXPERIENCE_SUCCESS,
	QUERY_WORKFLOW_TRANS_SUCCESS,
	GET_BUSINESS_PROJECT_TIPS_SUCCESS,
	SET_CURRENT_ROLE_ALLOCATION,
	SET_SURVEY
} from './types'
import VueCookie from 'vue-cookie'
import {
	STORAGE_KEY_USER,
	STORAGE_KEY_FLOW_STEP
} from './storageKey'
import accountService from "@/services/accountService";

const state = {
	loading: false,
	// 登录用户信息
	userInfo: JSON.parse(VueCookie.get(STORAGE_KEY_USER)) || null,
	// 流程设置步骤
	flowStep: JSON.parse(window.sessionStorage.getItem(STORAGE_KEY_FLOW_STEP)) || 0,
	userPermission: {},
	meta: {
		info: {
			huanxinId: null,
			team: null,
			path_id: null,
			node_id: null,
			pre_node_id: null,
			flow_id: null,
			process_type: 1,
			can_switch: true,
			project: null,
			name: '',
			nodeName: '',
			user_role_allocs: [],
			role_alloc_status: [],
			role_allocs: [],
			with_user_nodes: [],
			leader: null,
			isBanned: false,
			has_vote: false,
			end_vote: false,
			flashSrc: ''
		},
		trans: {
			data: [],
			show: false,
			title: '',
			type: 'forward',
			param: null
		},
		actionCmd: null,
		// 当前角色
		currentRoleAllocation: {},
		messages: [],
		guides: [],
		project_docs: {
			cur_docs: [],
			pre_docs: []
		},
		project_tips: [],
		process_actions: [],
		function_actions: [],
		experiences: [],
		survey: {}
	},
	messageData: []
};

const mutations = {
	[SHOW_LOADING](state) {
		state.loading = true
	},
	[HIDE_LOADING](state) {
		state.loading = false
	},
	[LOGIN_SUCCESS](state, data) {
		state.userInfo = data
	},
	[SET_PERMISSION](state, data) {
		state.userPermission = data
	},
	[LOGOUT_SUCCESS](state) {
		state.userInfo = null
	},
	[SET_FLOW_STEP](state, data) {
		state.flowStep = data
	},
	[SEND_MESSAGE_SUCCESS](state, data) {
		state.meta.messages.push(data)
	},
	[SET_CURRENT_ROLE_ALLOCATION](state, data) {
		state.meta.currentRoleAllocation = data
	},
	[DISPATCH_FLASH_ACTION](state, data) {
		state.meta.actionCmd = data
	},
	[EMPTY_ACTION_CMD](state) {
		state.meta.actionCmd = null
	},
	[START_ROLE_BANNED](state, data) {
		state.meta.info.isBanned = (parseInt(data) === 2)
	},
	[UPDATE_VOTE_STATUS](state, data) {
		state.meta.info.role_status = state.meta.info.role_status.map(role => {
			let rs = data.role_status_list.filter(r => r.role_id === role.role_id);
			role.vote_status = rs.length > 0 ? rs[0].vote_status : role.vote_status;
			return role
		});
		state.meta.info.end_vote = data.end_vote
	},
	[UPDATE_USER_ROLE_ALLOCS](state, data) {
		state.meta.info.user_role_allocs = state.meta.info.user_role_allocs.map(role_alloc => {
			let sa = data.filter(d => d.business_role_allocation_id === role_alloc.alloc_id);
			role_alloc.sitting_status = sa.length > 0 ? sa[0].sitting_status : role_alloc.sitting_status;
			return role_alloc
		})
	},
	[QUERY_VOTE_STATUS_SUCCESS](state, data) {
		state.meta.info.has_vote = data.has_vote;
		state.meta.info.end_vote = data.end_vote
	},
	[QUERY_WORKFLOW_TRANS_SUCCESS](state, data) {
		state.meta.trans.data = data
	},
	[GET_BUSINESS_NODE_MESSAGES_SUCCESS](state, data) {
		state.meta.messages = [];
		state.meta.messages.push(...data)
	},
	[GET_BUSINESS_DETAIL_SUCCESS](state, data) {
		state.meta.info.process_type = data.node.process_type;
		state.meta.info.path_id = data.path_id;
		state.meta.info.project = data.project;
		state.meta.info.team = data.team;
		state.meta.info.name = data.name;
		state.meta.info.nodeName = data.node.name;
		state.meta.info.with_user_nodes = data.with_user_nodes;
		if (data.role_allocs) {
			state.meta.info.role_allocs = data.role_allocs
		}
	},
	[GET_BUSINESS_NODE_DETAIL_SUCCESS](state, data) {
		state.meta.info.isBanned = data.control_status === 2;
		state.meta.info.role_alloc_status = data.role_alloc_status;
		state.meta.info.huanxinId = data.huanxin_id;
		state.meta.info.flow_id = data.flow_id;
		state.meta.info.pre_node_id = data.pre_node_id;
		// state.meta.info.leader = data.leader
		state.meta.info.node_id = data.node.id;
		state.meta.info.has_vote = data.has_vote;
		state.meta.info.end_vote = data.end_vote;
		state.meta.info.flashSrc = data.process.file;
		state.currentRoleAllocation = data.role_allocs.length > 0 ? data.role_allocs[0] : null;
		state.meta.info.user_role_allocs = data.role_allocs;
		state.meta.info.can_switch = data.process.can_switch
	},
	[GET_BUSINESS_NODE_DOCS_SUCCESS](state, data) {
		state.meta.guides = data.operation_guides;
		state.meta.project_docs.cur_docs = data.cur_doc_list;
		state.meta.project_docs.pre_docs = data.pre_doc_list
	},
	[GET_BUSINESS_PROJECT_TIPS_SUCCESS](state, data) {
		state.meta.project_tips = data
	},
	[GET_BUSINESS_NODE_FUNCTION_SUCCESS](state, data) {
		state.meta.function_actions = data.function_action_list;
		state.meta.process_actions = data.process_action_list
	},
	[GET_BUSINESS_EXPERIENCE_SUCCESS](state, data) {
		state.meta.experiences = [];
		state.meta.experiences.push(...data.filter(e => e.status === 2))
	},
	[SEND_EXPERIENCE](state, data) {
		let ex = {
			content: data.ext.opt.content,
			create_time: data.ext.opt.create_time,
			created_by: {
				username: data.ext.opt.created_by.username,
				name: data.ext.opt.created_by.name
			},
			status: 2
		};
		state.meta.experiences.push(ex)
	},
	[SET_SURVEY](state, data) {
		state.meta.survey = data
	},
	refreshMsg(state) {
		accountService
			.getMessageData()
			.then(data => {
				state.messageData = data.results;
			})
	}
};

export default {
	state,
	mutations
}
