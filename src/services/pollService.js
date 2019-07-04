import xhr from './xhr/'

/**
 * Dictionary API
 */
class PollService {

    getInitPollData(data) {
        return xhr({
            method: 'post',
            url: '/business/poll/getInitPollData',
            params: data
        })
    }

    savePollData(data) {
        return xhr({
            method: 'post',
            url: '/business/poll/savePollData',
            params: data
        })
    }

    userPollSave(data) {
        return xhr({
            method: 'post',
            url: '/business/poll/userPollSave',
            params: data
        })
    }

}

export default new PollService()