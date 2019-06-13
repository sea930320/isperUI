<template>
    <div class="chataudio-wrap">
        <div class="audio-player">
            <div class="audio-content clearfix">
                <div class="audio-play" @click="touchCover">
                    <svg
                        v-if="!state.playing"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="#1185fe"
                        class="AudioPlayerSkin-controlButtonIcon-3HjX"
                        data-name="play-new"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M17.6 11.43c.533.314.533.826 0 1.14L6.965 18.866c-.533.315-.965.06-.965-.57V5.704c0-.63.433-.885.965-.57L17.6 11.43z"
                        ></path>
                    </svg>
                    <svg
                        v-if="state.playing"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="#1185fe"
                        class="AudioPlayerSkin-controlButtonIcon-3HjX"
                        data-name="pause-new"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M15 6.5c0-.276.214-.5.505-.5h.99c.28 0 .505.23.505.5v11c0 .276-.214.5-.505.5h-.99a.506.506 0 0 1-.505-.5v-11zm-7 0c0-.276.214-.5.505-.5h.99c.28 0 .505.23.505.5v11c0 .276-.214.5-.505.5h-.99A.506.506 0 0 1 8 17.5v-11z"
                        ></path>
                    </svg>
                </div>
                <div
                    class="audio-length fr"
                >{{state.playing ? mu.state.currentTimeFormat : mu.state.durationTimerFormat}}</div>
            </div>
            <div class="audio-progress" :style="{width: progressWidth}"></div>
        </div>
    </div>
</template>
<script>
// import Audio from "./audio";
// import AmrConvert from "./amrConvert";
export default {
    props: {
        src: {
            type: String
        },
        options: {
            type: Object,
            default: () => {
                return {
                    preload: false,
                    autoplay: false,
                    rate: 1,
                    loop: false,
                    volume: 0.5
                };
            }
        }
    },
    data() {
        return {
            mu: {
                state: {
                    startLoad: false,
                    failed: false,
                    try: 3,
                    tried: 0,
                    playing: false,
                    paused: false,
                    playbackRate: 1.0,
                    progress: 0,
                    currentTime: 0,
                    duration: 0,
                    volume: 0.5,
                    loaded: "0",
                    durationTimerFormat: "00:00",
                    currentTimeFormat: "00:00",
                    lastTimeFormat: "00:00"
                }
            },
            state: {
                moving: false,
                playing: false
            },
            isPlaying: false
        };
    },
    computed: {
        progressWidth() {
            return (
                (this.mu.state.currentTime / this.mu.state.duration) * 100 + "%"
            );
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.initAudio();
        },
        initAudio() {
            // let _this = this;
            // let ac = new AmrConvert();
            // ac.blobUrl(this.src, function(url) {
            //     _this.mu = new Audio(url, _this.options);
            // });
        },
        touchCover() {
            if (this.state.playing) {
                this.pause();
            } else {
                this.play();
            }
        },
        play() {
            this.state.playing = true;
            this.mu.play();
        },
        pause() {
            this.state.playing = false;
            this.mu.pause();
        }
    }
};
</script>
<style>
.chataudio-wrap {
    max-width: 120px;
    padding: 4px 10px 2px;
    border-radius: 4px;
    border: 1px solid #1185fe;
}
.audio-wrap {
    position: relative;
    padding: 12px 20px 12px 12px;
    border: 1px solid #ebebeb;
    background-color: #fcfcfc;
    overflow: hidden;
}
.audio-content {
    height: 25px;
}
.audio-play-area {
    width: 18px;
    margin-right: 10px;
}
.audio-progress {
    position: absolute;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #0cbb08;
    /*width: 20%;*/
    height: 2px;
}
/*.audio-player * {
  box-sizing: border-box;
  vertical-align: middle;
}
.audio-player *:after,
.audio-player *:before {
  box-sizing: content-box;
}*/
.audio-play {
    display: inline-block;
    width: 45px;
    height: 25px;
    margin-left: -10px;
    position: relative;
    overflow: hidden;
    font-size: 12px;
}
.audio-play > .horn {
    display: block;
    width: 30px;
    height: 30px;
    background-color: #0dbb00;
}
.audio-play > .horn.animation {
    /*-webkit-animation: hronZoom 1s infinite;
          animation: hronZoom 1s infinite;*/
}
/*.audio-play > .horn:before {
  content: "";
  display: block;
  position: absolute;
  top: -0.4em;
  left: -0.4em;
  width: .8em;
  height: .8em;
  border: .4em solid #fcfcfc;
  border-radius: 50%;
}
.audio-play > .horn:after {
  content: "";
  display: block;
  position: absolute;
  top: -1.1em;
  left: -1.1em;
  width: 2.2em;
  height: 2.2em;
  border: .4em solid #fff;
  border-radius: 50%;
}*/
/*.audio-play:before,
.audio-play:after {
  content: "";
  display: block;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 50%;
  background-color: #fcfcfc;
  -webkit-transform-origin: 1.8em 1.8em;
      -ms-transform-origin: 1.8em 1.8em;
          transform-origin: 1.8em 1.8em;
  -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
          transform: rotate(0deg);
}
.audio-play:after {
  -webkit-transform-origin: 2em 0em;
      -ms-transform-origin: 2em 0em;
          transform-origin: 2em 0em;
  -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
          transform: rotate(90deg);
}*/
@-webkit-keyframes hronZoom {
    0% {
        width: 0;
        height: 0;
    }
    100% {
        width: 30px;
        height: 30px;
    }
}
@keyframes hronZoom {
    0% {
        width: 0;
        height: 0;
    }
    100% {
        width: 30px;
        height: 30px;
    }
}
</style>
