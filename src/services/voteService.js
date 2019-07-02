import xhr from './xhr/'

/**
 * Dictionary API
 */
class VoteService {

    getInitVoteData(data) {
        return xhr({
            method: 'post',
            url: '/business/vote/getInitVoteData',
            params: data
        })
    }

    saveVoteData(data) {
        return xhr({
            method: 'post',
            url: '/business/vote/saveVoteData',
            params: data
        })
    }

    finishVote(data) {
        return xhr({
            method: 'post',
            url: '/business/vote/finishVote',
            params: data
        })
    }

    userVoteSave(data) {
        return xhr({
            method: 'post',
            url: '/business/vote/userVoteSave',
            params: data
        })
    }

}

export default new VoteService()