import { STORAGE_KEY_USER } from "@/store/storageKey";
import { mapState } from "vuex";
import _ from 'lodash';

export default {
    data: function () {
        return {
            get template_size() {
                return 'sm'
            },
            get pageSizeOption() {
                return [{
                    text: 5,
                    value: 5
                },
                {
                    text: 10,
                    value: 10
                },
                {
                    text: 15,
                    value: 15
                },
                {
                    text: 20,
                    value: 20
                }
                ]
            }
        }
    },
    methods: {
        browserDetect: function () {
            if (/Android/.test(navigator.userAgent)) return 'Android'
            if (/Edge/.test(navigator.userAgent)) return 'Edge'
            if (/Firefox/.test(navigator.userAgent)) return 'Firefox'
            if (/Google Inc/.test(navigator.vendor)) return 'Google Chrome'
            if (/CriOS/.test(navigator.userAgent)) return 'Chrome IOS'
            if (!!window.chrome && !/Edge/.test(navigator.userAgent)) return 'ChromiumBase'
            if (/Trident/.test(navigator.userAgent)) return 'IE'
            if (/(iPhone|iPad|iPod)/.test(navigator.platform)) return 'IOS'
            if (/OPR/.test(navigator.userAgent)) return 'Opera'
            if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) return 'Safari'
        },
        isActionAllowed(permissionCodeName, actionCodeName) {
            if (!this.userPermission) return true
            if (this.userPermission[permissionCodeName]) {
                if (_.some(this.userPermission[permissionCodeName], action => {
                    return action.codename === actionCodeName
                })) {
                    return true
                } else return false
            }
            return false
        },
        isPermissionAllowed(permissionCodeName) {
            if (!this.userPermission) return true
            if (this.userPermission[permissionCodeName]) {
                return true
            } else return false
        }
    },
    computed: {
        ...mapState(["userPermission"]),
        isLoggedIn() {
            const USER = JSON.parse(this.$cookie.get(STORAGE_KEY_USER));
            if (USER) {
                return true
            } else {
                return false
            }
        }
    }
}