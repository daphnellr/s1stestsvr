import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 存储页面全局变量
const Page = new Vuex.Store({
    state: {
        level: [],
        user: ""
    },
    getters: {
        getLevel: state => {
            return state.level;
        },
        getUser: state => {
            return state.user;
        }
    },
    mutations: {
        jump: (state, level) => {
            state.level = level;
        },
        login: (state, user) => {
           state.user = user;
        }
    },
    actions: {
        setLevel: (context, level) => {
            context.commit("jump", level);
        },
        setUser: (context, user) => {
            context.commit("login", user);
        }
    }
});

export default Page;
