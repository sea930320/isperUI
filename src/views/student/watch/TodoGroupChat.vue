<template>
  <b-row class="todo-group-chat">
    <b-col cols="8" class="py-4 pl-2 pr-1" style="height: calc(100vh - 250px);">
      <b-card style="height: 70%; margin-bottom: 2%;" class="text-left chatcard">
        <section ref="chat" class="chatlist" v-scroll-bottom="messages">
          <ul>
            <template v-for="(item, index) in messages">
              <li
                class="chat-bubble chat-mine"
                :key="index"
                v-if="item.from_user.id !== userInfo.id"
              >
                <div class="chat-user">
                  <img src="@/assets/imgIsper/business/avatar1.png" />
                </div>
                <div class="time">
                  <cite>
                    <i>{{item.create_time}}</i>
                    {{item.from_user.name}}（{{item.from_user.login_type==9 ? "学生": (item.from_user.position ? item.from_user.position.name : "")}}）
                  </cite>
                </div>
                <div class="chat-text" v-html="replaceFace(item)"></div>
              </li>
              <li class="chat-bubble chat-others" :key="index" v-else>
                <div class="chat-user">
                  <img src="@/assets/imgIsper/business/avatar2.png" />
                </div>
                <div class="time">
                  <cite>
                    {{item.from_user.name}}（{{item.from_user.login_type==9 ? "学生": (item.from_user.position ? item.from_user.position.name : "")}}）
                    <i>{{item.create_time}}</i>
                  </cite>
                </div>
                <div class="chat-text" v-html="replaceFace(item)"></div>
              </li>
            </template>
          </ul>
        </section>
      </b-card>
      <div class="chat-input">
        <div class="emoji-wrapper" v-show="showSelBox == 1">
          <ul class="p-0 m-1">
            <li class="emoji-item" v-for="(item, index) in emoji.img" :key="index">
              <img
                width="32"
                height="32"
                :src="require('@/assets/imgIsper/emoji/'+item)"
                :alt="emoji.code[index]"
                :data="emoji.code[index]"
                @click.stop="selectEmoji(emoji.code[index])"
              />
            </li>
          </ul>
        </div>
        <div class="speak-option">
          <span @click.stop="showSelBox=showSelBox==1?0:1">
            <icon name="laugh"></icon>
          </span> &nbsp;
          <span @click.stop="sendDoc">
            <icon name="image"></icon>
          </span> &nbsp;
          <span></span>
        </div>
        <div class="speak-field">
          <textarea name="name" placeholder="请输入发言内容" maxlength="200" v-model.trim="content"></textarea>
        </div>
        <div class="speak-submit">
          <b-button-group class="fr">
            <b-button size="sm" variant="outline-primary" @click="sendMsg">发送</b-button>
          </b-button-group>
          <p class="limit-num fr p-0 m-0 mr-2">
            <span v-if="content.length == 0">
              最多输入
              <i>200</i>个字
            </span>
            <span v-if="content.length > 0">
              还可输入
              <i>{{200 - content.length}}</i>个字
            </span>
          </p>
        </div>
      </div>
    </b-col>
    <b-col cols="4" class="py-0 pl-1 pr-0">
      <div class="py-3 text-left team-members p-3">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="search" placeholder="请输入内容" />
        </b-input-group>
        <hr style="border-top: 1px solid rgba(255, 255, 255, 0.3);" />
        <template v-for="(user, index) in filtered_users">
          <div class="team_user mb-2" :key="index">
            <icon name="user"></icon>
            <span class="ml-3 mr-4">{{user.name}}</span>
            <a @click="cancelAssist(user)" v-if="userInfo.role==5 && user.is_student && user.id">
              <icon name="power-off" style="cursor:pointer;"></icon>
            </a>
          </div>
        </template>
      </div>
    </b-col>

    <b-modal v-model="cancelModal" title="解除助理提醒" size="md" :showPerson="true">
      <b-container fluid>是否确定{{cancelUser && cancelUser.name}}解除助理关系？</b-container>

      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="confirmCancel()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="cancelModal=false">取消</b-button>
      </div>
    </b-modal>
    <!-- upload-modal -->
    <upload-modal @on-uploadConfirm="docUploadConfirm"></upload-modal>
  </b-row>
</template>
<script>
import emoji from "@/components/business/common/emoji";
import studentService from "@/services/studentService";
import { businessStatus, gender } from "@/filters/fun";
import uploadModal from "@/components/common/uploadModal";

import _ from "lodash";

export default {
  components: { uploadModal },
  sockets: {
    connect() {},
    getStudentMessage(msg) {
      let message = msg.result;
      if (
        message.msg_type == 1 &&
        message.business_id == this.business.id &&
        _.some(message.to, { id: this.userInfo.id })
      ) {
        this.messages.push(message);
      }
    }
  },
  props: {
    todo_users: {
      type: Array,
      default: () => []
    },
    business: {
      type: Object,
      default: () => {}
    }
  },
  directives: {
    // 发送消息后滚动到底部
    "scroll-bottom"(el, binding, vnode) {
      vnode.context.$nextTick(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      });
    },
    // 换行符
    "line-break"(el, binding) {
      el.innerHTML = binding.value.replace(/\r?\n|\r/g, "<br/>");
    }
  },
  data() {
    return {
      emoji: emoji,
      showSelBox: 0,
      content: "",
      search: "",
      messages: [],
      cancelUser: null,
      cancelModal: false
    };
  },
  filters: { businessStatus, gender },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    filtered_users() {
      return this.todo_users.filter(user => {
        return (
          (user.name && user.name.includes(this.search)) ||
          (user.username && user.username.includes(this.search))
        );
      });
    }
  },
  mounted() {
    document.addEventListener("click", () => {
      this.showSelBox = 0;
    });
    document.addEventListener("keyup", e => {
      if (e.ctrlKey && e.keyCode === 13) {
        this.sendMsg();
      }
    });
  },
  watch: {},
  methods: {
    init() {
      studentService
        .messageList({
          business_id: this.business.id,
          msg_type: 1
        })
        .then(data => {
          this.messages = data.results;
        });
    },
    selectEmoji(data) {
      if (this.content.length >= 200) {
        return;
      }
      this.content += data;
      this.showSelBox = 0;
    },
    sendMsg() {
      if (
        !this.business.id ||
        this.content === "" ||
        this.todo_users.length == 0
      ) {
        return;
      }

      studentService
        .sendMessage({
          business_id: this.business.id,
          to: JSON.stringify(this.todo_users),
          msg: this.content,
          msg_type: 1
        })
        .then(() => {
          this.content = "";
        });
    },
    sendDoc() {
      this.$emit("openUploadModal", {
        uploadUrl: "/api/student/send-doc",
        uploadParams: {
          business_id: this.business.id,
          to: JSON.stringify(this.todo_users),
          msg_type: 1
        }
      });
    },
    docUploadConfirm() {},
    // 替换表情代码
    replaceFace(item) {
      let msg = item.msg
      if (!msg) return "";
      let self = this;
      if (item.url) {
        if (item.file_type == 2) {
          return `<a href="${item.url}" target="_blank"> <img class="msg-img" src="${item.url}"> </a>`;
        } else {
          return `<a href="${item.url}" target="_blank"> ${msg} </a>`;
        }
      }
      /* eslint-disable */
      let con = msg.replace(/\[[^\[\]]+\]/g, function(item) {
        let index = self.emoji.code.indexOf(item);
        let src = require("@/assets/imgIsper/emoji/" + self.emoji.img[index]);
        return '<img src="' + src + '" alt="" />';
      });
      return con;
    },
    cancelAssist(student) {
      this.cancelUser = student;
      this.cancelModal = true;
    },
    confirmCancel() {
      studentService
        .requestAssistUpdate({
          id: this.cancelUser.request_id,
          del_flag: 1,
          status: 2
        })
        .then(data => {
          this.$emit("canceled-assist");
          this.cancelModal = false;
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.todo-group-chat {
  height: 100%;

  .chatcard {
    .card-body {
      height: 100%;
    }
  }
  .chatlist {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    .msg-img {
      width: 100px !important;
      height: auto !important;
    }
    ul,
    ol {
      padding: 0px;
      list-style: none;
      .chat-status {
        position: relative;
        margin-bottom: 10px;
        padding-left: 60px;
        text-align: center;
        .status-info {
          display: inline-block;
          font-size: 12px;
          line-height: 20px;
          padding: 0 20px;
          border-radius: 10px;
          background-color: #ccc;
        }
      }
      .chat-bubble {
        position: relative;
        margin-bottom: 10px;
        padding-left: 60px;
        min-height: 68px;
        text-align: left;
        .chat-user {
          position: absolute;
          left: 3px;
          top: 10px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
          }
        }
        .time {
          width: 100%;
          cite {
            font-style: normal;
            line-height: 24px;
            font-size: 12px;
            white-space: nowrap;
            color: #999;
            text-align: left;
            i {
              font-style: normal;
              padding-left: 5px;
              padding-right: 5px;
              font-size: 12px;
            }
          }
        }
        .chat-text {
          position: relative;
          line-height: 22px;
          padding: 5px 15px;
          min-height: 32px;
          border-radius: 3px;
          color: #253568;
          word-break: break-all;
          max-width: 462px\9;
          background: #e9ecef;
          img {
            height: 22px;
            margin-top: -4px;
            width: 22px;
          }
        }
        .chat-text:after {
          content: "";
          position: absolute;
          left: -10px;
          top: 5px;
          width: 0;
          height: 0;
          border-style: solid dashed dashed;
          border-color: #e9ecef transparent transparent;
          overflow: hidden;
          border-width: 10px;
        }
        .chat-text,
        .chat-user {
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
        }
      }
      .chat-mine {
        text-align: right;
        padding-left: 0;
        padding-right: 60px;
        .chat-user {
          left: auto;
          right: 3px;
        }
        .chat-text {
          margin-left: 0;
          text-align: left;
          background-color: #6787e7;
          color: #fff;
        }
        .chat-text:after {
          left: auto;
          right: -10px;
          border-top-color: #6787e7;
        }
      }
    }
  }
  .chatlist::-webkit-scrollbar {
    width: 0em;
  }
  .chat-input {
    height: 28%;
    display: flex;
    flex-direction: column;
    left: 0px;
    width: 100%;
    position: relative;

    .speak-option {
      color: #909090;
      text-align: left;
      padding-left: 0px;
    }
    .speak-field {
      height: calc(100% - 75px);
      margin-top: 4px;
      textarea {
        height: 100%;
        width: 100%;
        border: 0px;
        padding: 10px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        resize: none;
        font-size: 14px;
      }
    }
    .emoji-wrapper {
      z-index: 1;
      position: absolute;
      border-radius: 2px;
      background: #fff;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0px;
      -webkit-box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
      box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 12px 0px;
      top: -5px;
      margin-left: 34px;
      ul {
        li {
          cursor: pointer;
          display: inline-block;
          margin: 2px 3px 0 3px;
        }
      }
    }

    .speak-submit {
      float: right;
      margin-top: 10px;
      margin-right: 5px;

      .limit-num {
        margin-top: 5px !important;
        font-size: 15px;
      }
    }
  }
  .team-members {
    height: 100%;
    background: rgba(58, 125, 224, 0.5);
    overflow: auto;

    .team_user {
      display: flex;
      line-height: 29px;
      color: white;
      margin-left: 10px;
      font-size: 16px;
      .fa-icon {
        margin: auto 0px;
        color: white;
      }
    }
  }
}
</style>
