<template>
    <div class="project-guide-wrap">
        <p v-if="guides.length == 0">无</p>
        <p
            v-else
            v-for="(guide, index) in guides"
            :key="index"
            v-html="replaceContent(guide.content)"
        ></p>
    </div>
</template>
<script>
export default {
    name: "ProgressProjectGuide",
    computed: {
        guides() {
            return this.$store.state.meta.guides;
        }
    },
    methods: {
        replaceContent(con) {
            if (con) {
                return con.replace(/\r?\n|\r/g, "<br/>");
            } else {
                return "";
            }
        }
    }
};
</script>
<style scoped>
.project-guide-wrap p {
    font-size: 16px;
}
</style>
