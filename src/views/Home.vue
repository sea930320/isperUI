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
                  <h5>Description</h5>
                </div>
                <div class="login-btn px-2">
                  <b-button to="login" variant="light" class="px-3">登陆</b-button>
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
                      <b-link :href="notification.all_link">View All >></b-link>
                    </div>
                    <!-- <hr class="p-0 m-0"> -->
                    <b-list-group>
                      <b-list-group-item
                        v-for="(post, index) in notification.posts"
                        :key="index"
                        class="notification-list-item p-1"
                      >
                        <b-link :href="post.link">{{post.title}}</b-link>
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
          category: "xxx1",
          bgcolor: "#2a3970",
          posts: [
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            }
          ]
        },
        {
          category: "xxx2",
          bgcolor: "#d75852",
          posts: [
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            }
          ]
        },
        {
          category: "xxx3",
          bgcolor: "#4e73ff",
          posts: [
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
              link: "#"
            },
            {
              title: "aaaaa",
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