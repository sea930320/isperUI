<template>
    <div class="log-statistic">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv w-100">
            <b-form-radio-group v-model="selectedTab" :options="tabOptions"></b-form-radio-group>
            <b-row class="mt-3">
                <b-col cols="8" class="align-self-center d-flex justify-content-between">
                    <b-form-select
                        v-if="userInfo.identity==1"
                        :size="template_size"
                        class="mx-1"
                        v-model="queryParam.group_id"
                        :options="groups"
                        value-field="id"
                        text-field="name"
                        style="flex:1"
                    ></b-form-select>
                    <b-form-select
                        v-if="[1,2,6].includes(userInfo.identity)"
                        :size="template_size"
                        class="mx-1"
                        v-model="queryParam.company_id"
                        :options="companies"
                        value-field="id"
                        text-field="name"
                        style="flex:1"
                    ></b-form-select>
                </b-col>
                <b-col cols="4">
                    <date-picker class="mx-2" v-model="queryParam.range" range format="YYYY-MM-DD"></date-picker>
                </b-col>
            </b-row>
            <b-row class="mt-5 justify-content-center">
                <b-col cols="6" v-if="selectedTab===0">
                    <div>
                        <apexchart
                            ref="workLogChart"
                            width="100%"
                            height="400"
                            type="bar"
                            :options="workLogOptions"
                            :series="workLogSeries"
                        ></apexchart>
                    </div>
                </b-col>
                <b-col cols="10" v-else>
                    <div>
                        <apexchart
                            ref="userChart"
                            width="100%"
                            type="line"
                            height="400"
                            :options="userOptions"
                            :series="userSeries"
                        ></apexchart>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
// import _ from "lodash";
import DatePicker from "vue2-datepicker";
import { mapState } from "vuex";
import groupService from "@/services/groupService";
import accountService from "@/services/accountService";

export default {
    name: "log-statistic",
    components: {
        Loading,
        DatePicker
    },
    created() {
        this.$nextTick(() => {
            this.queryParam.group_id = [2, 6].includes(this.userInfo.identity)
                ? this.userInfo.manager_info.group_id
                : null;
            this.getData();
            if ([1, 2, 6].includes(this.userInfo.identity)) {
                this.getGroupList();
            }
        });
    },
    data() {
        return {
            selectedTab: 0,
            tabOptions: [
                { text: "WorkLog Statistic", value: 0 },
                { text: "User Statistic", value: 1 }
            ],
            queryParam: {
                range: "",
                group_id: null,
                company_id: null
            },
            groups: [],
            workLogOptions: {
                chart: {
                    id: "worklog-chart"
                },
                xaxis: {
                    categories: ["流程管理", "项目管理", "系统设置", "业务管理"]
                }
            },
            workLogSeries: [
                {
                    name: "WorkLog Chart",
                    data: [0, 0, 0, 0]
                }
            ],
            userOptions: {
                chart: {
                    id: "user-chart",
                    animations: {
                        enabled: true,
                        easing: "linear",
                        dynamicAnimation: {
                            speed: 1000
                        }
                    },
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "smooth"
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: "datetime"
                },
                legend: {
                    show: false
                }
            },
            userSeries: [
                {
                    name: "User Chart",
                    data: []
                }
            ]
        };
    },
    watch: {
        selectedTab: {
            handler() {
                this.getData();
            },
            deep: true
        },
        queryParam: {
            handler() {
                this.getData();
            },
            deep: true
        },
        "queryParam.group_id": {
            handler() {
                this.queryParam.company_id = null;
            }
        }
    },
    computed: {
        ...mapState(["userInfo"]),
        companies() {
            let items = [
                {
                    id: null,
                    name: "单位筛选"
                }
            ];
            if (!this.queryParam.group_id) {
                return items;
            }
            let currentGroup = this.groups.filter(
                group => group.id == this.queryParam.group_id
            );
            if (currentGroup.length > 0) {
                items = [
                    ...items,
                    ...currentGroup[0]["companies"].filter(
                        company => company.name != "DEFAULT-COMPANY"
                    )
                ];
            }
            return items;
        }
    },
    methods: {
        getGroupList() {
            groupService
                .fetchAllGroupDetail()
                .then(data => {
                    this.groups = data.results;
                    this.groups.unshift({
                        id: null,
                        name: "集群筛选"
                    });
                })
                .catch(() => {});
        },
        getData() {
            if (this.selectedTab == 0) {
                this.fetchWorklogStatistic();
            } else {
                this.fetchUserStatistic();
            }
        },
        fetchWorklogStatistic() {
            this.run();
            let param = {
                ...this.queryParam
            };
            delete param.range;
            if (this.queryParam.range != "") {
                param["start_date"] = this.queryParam.range[0]
                    ? this.$moment(this.queryParam.range[0]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
                param["end_date"] = this.queryParam.range[1]
                    ? this.$moment(this.queryParam.range[1]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
            } else {
                param["start_date"] = "";
                param["end_date"] = "";
            }
            accountService
                .getWorkLogStatistic(param)
                .then(data => {
                    let seriesData = [
                        data.results.workflow,
                        data.results.project,
                        data.results.system,
                        data.results.business
                    ];
                    this.workLogSeries.data = seriesData;
                    this.$refs.workLogChart.updateSeries([
                        {
                            data: seriesData
                        }
                    ]);
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        getDayWiseTimeSeries(baseval, count, yrange) {
            var i = 0;
            let data = [];
            while (i < count) {
                var x = baseval;
                var y =
                    Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
                    yrange.min;

                data.push({
                    x,
                    y
                });
                baseval += 86400000;
                i++;
            }
            setTimeout(() => {
                this.$refs.userChart.updateSeries([
                    {
                        data
                    }
                ]);
            }, 20);
        },
        fetchUserStatistic() {
            this.getDayWiseTimeSeries(
                new Date().getTime(),
                50,
                {
                    min: 0,
                    max: 100
                }
            );
            // this.run();
            // let param = {
            //     ...this.queryParam
            // };
            // delete param.range;
            // if (this.queryParam.range != "") {
            //     param["start_date"] = this.queryParam.range[0]
            //         ? this.$moment(this.queryParam.range[0]).format(
            //               "YYYY-MM-DD"
            //           )
            //         : "";
            //     param["end_date"] = this.queryParam.range[1]
            //         ? this.$moment(this.queryParam.range[1]).format(
            //               "YYYY-MM-DD"
            //           )
            //         : "";
            // } else {
            //     param["start_date"] = "";
            //     param["end_date"] = "";
            // }
            // accountService
            //     .getUserStatistic(param)
            //     .then(data => {
            //         this.$emit("data-ready");
            //     })
            //     .catch(() => {
            //         this.$emit("data-failed");
            //     });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.log-statistic {
    .mx-input {
        height: 31px;
    }
}
</style>