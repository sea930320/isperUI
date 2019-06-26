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

}

export default new VoteService()