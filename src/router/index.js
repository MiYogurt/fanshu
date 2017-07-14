import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ArticleList from '@/pages/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleShow from '@/pages/article/index'
import ArticleEdit from '@/pages/article/edit'
import User from '@/pages/user/index'
import Followee from '@/pages/user/myFollowee'
import Follower from '@/pages/user/myFollower'
import Friend from '@/pages/user/friend'
import Message from '@/pages/user/myMessage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/article',
      name: 'ArticleList',
      component: ArticleList
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    },

    {
     path: '/article/create',
     name: 'ArticleCreate',
     component: ArticleCreate,
     meta: {
       needLogin: true
     }
    },
    {
      path: '/article/:id',
      name: 'ArticleShow',
      component: ArticleShow,
    },
    {
      path: '/followee',
      nanme: 'Followee',
      component: Followee,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/follower',
      nanme: 'Follower',
      component: Follower,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/friend',
      nanme: 'Friend',
      component: Friend,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/messsage',
      nanme: 'Message',
      component: Message,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User,
    },
    {
      path: '/article/:id/edit',
      name: 'ArticleEdit',
      component: ArticleEdit,
      meta: {
       needLogin: true
      }
    }
  ]
})
