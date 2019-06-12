import {
    mapState
} from "vuex";

export default {
    computed: {
        ...mapState(["userInfo"]),
        prefixRoute() {
            const role = this.userInfo.role;
            if ([1, 2, 3].includes(role)) {
                return "/manager/";
            } else if ([4].includes(role)) {
                return "/instructor/";
            } else if ([6, 7, 8].includes(role)) {
                return "/assistant/";
            } else {
                return "/business/";
            }
        }
    },
}