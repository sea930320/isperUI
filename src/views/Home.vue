<template>
  <div class="home-container">
    <TopHeader>
      <template v-slot:pageTitle>首页界面——首页（新设计）</template>
    </TopHeader>
    <b-container>
      <b-card>
        <b-row>
          <b-col cols="6" class="d-flex justify-content-center flex-column">
            <b-card no-body>
              <div class="d-flex justify-content-center p-3">
                <div class="logo-icon px-2">
                  <img src="@/assets/logo.png">
                </div>
                <div class="logo-text px-2">
                  <h2>ISPER--2019</h2>
                  <h5>智慧法治与智慧课堂系统</h5>
                </div>
                <div class="login-btn px-2">
                  <b-button to="login" variant="light" class="px-3">登陆</b-button>
                  <b-button to="register" variant="light" class="px-3">注册</b-button>
                </div>
              </div>
            </b-card>
          </b-col>
          <b-col cols="6" class="d-flex flex-column">
            <b-card
              no-body
              v-for="notification in notificationList"
              :key="notification.category"
              class="my-3"
            >
              <div class="p-0">
                <b-row no-gutters>
                  <b-col
                    cols="3"
                    :style="{'backgroundColor': notification.bgcolor}"
                    class="d-flex justify-content-center flex-column notification-left"
                  >{{notification.category}}</b-col>
                  <b-col cols="9">
                    <div
                      class="list-header d-flex justify-content-between align-items-center px-3 py-1"
                      style="fontSize: 18px"
                    >
                      {{notification.category}}
                      <b-link :to="notification.all_link">更多>></b-link>
                    </div>
                    <!-- <hr class="p-0 m-0"> -->
                    <b-list-group>
                      <b-list-group-item
                        v-for="(post, index) in notification.posts"
                        :key="index"
                        class="notification-list-item p-1"
                      >
                        <b-link :to="post.link">{{post.title}}</b-link>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import TopHeader from "@/components/header/TopHeader";

export default {
  name: "home",
  components: { TopHeader },
  data() {
    return {
      notificationList: [
        {
          category: "公告通知",
          bgcolor: "#2a3970",
          posts: [
            {
              title: "2017-2018学年优秀本科生颁奖典礼举行",
              link: "#"
            },
            {
              title: "学校2018年就业质量报告来了",
              link: "#"
            },
            {
              title: "校友会2019中国财经类大学排名出炉。。。",
              link: "#"
            },
            {
              title: "庆：2018年中南大学年度汉字出炉",
              link: "#"
            },
            {
              title: "学校启动教职工大病医疗互助机制",
              link: "#"
            }
          ]
        },
        {
          category: "实验观摩",
          bgcolor: "#d75852",
          posts: [
            {
              title: "2018药品管理法实验",
              link: "#"
            },
            {
              title: "律师调解通用模拟实验3",
              link: "#"
            },
            {
              title: "省级人大常委会立法过程实验提案阶段2",
              link: "#"
            },
            {
              title: "蔡获侵权责任纠纷案民事诉讼审前实验",
              link: "#"
            },
            {
              title: "美美形体中心个体工商户设立登记的模拟实验2",
              link: "#"
            }
          ]
        },
        {
          category: "问卷调查",
          bgcolor: "#4e73ff",
          posts: [
            {
              title: "关于2018届毕业生就业情况的问卷调查",
              link: "#"
            },
            {
              title: "学校2018年ISPER系统UI用户体验调查",
              link: "#"
            },
            {
              title: "江夏区食品监管与质量抽检调查",
              link: "#"
            },
            {
              title: "大学生心理健康问卷调查",
              link: "#"
            },
            {
              title: "大学生身体素质问卷调查",
              link: "#"
            }
          ]
        }
      ]
    };
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.home-container {
  .notification-left {
    color: white;
    font-size: 22px;
  }
  .notification-list-item {
    border-right-width: 0 !important;
    border-bottom-width: 0 !important;
  }
  .notification-list-item.list-group-item:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .logo-icon {
    img {
      width: 100px;
    }
  }
  .logo-text {
    align-self: center;
  }
  .login-btn {
    align-self: center;
  }
}
</style>