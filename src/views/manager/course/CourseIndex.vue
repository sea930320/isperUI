<template>
    <div class="course-index">
        <b-tabs v-if="userInfo.identity === 3" v-model="tabIndex">
            <b-tab title="校定课堂管理">
                <ClassicCourse/>
            </b-tab>
            <b-tab title="兴趣课堂管理">
                <HobbyCourse/>
            </b-tab>
            <b-tab title="课外学习管理">
                <OutsideCourse/>
            </b-tab>
            <b-tab title="关注管理">
                <AttentionCourse/>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import ClassicCourse from './ClassicCourse';
    import OutsideCourse from './OutsideCourse';
    import HobbyCourse from './HobbyCourse';
    import AttentionCourse from './AttentionCourse';

    export default {
        name: "course-index",
        components: {
            ClassicCourse,
            HobbyCourse,
            AttentionCourse,
            OutsideCourse,
        },
        computed: {
            ...mapState(["userInfo"])
        },
        data() {
            return {
                tabIndex: 0
            };
        },
        created() {
        },
        methods: {
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .course-index {
        .tabs {
            ul.nav-tabs {
                justify-content: center;

                .nav-link.active,
                .nav-item.show .nav-link {
                    color: #007bff !important;
                    background-color: transparent;
                }
            }
        }

        .nav-item {
            width: 10%;
        }

        .mt-2 .nav.nav-tabs{
            width: 20%;
            margin: auto;
        }
        .mt-2 .nav-item {
            width: 50%;
        }
    }
</style>
