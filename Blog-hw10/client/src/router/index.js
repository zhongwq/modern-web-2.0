import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Posts from '@/components/Posts'
import Post from '@/components/Post'
import AddPost from '@/components/addPost'
import EditPost from '@/components/EditPost'
import Setting from '@/components/Setting'
import Profile from '@/components/Profile'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'Posts'
    },
    {
      path: '/post/add',
      name: 'AddPost',
      component: AddPost
    },
    {
      path: '/post/edit/:id',
      name: 'EditPost',
      component: EditPost
    },
    {
      path: '/post/:id',
      name: 'Post',
      component: Post
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('token') || sessionStorage.getItem('token') === 'null') {
    if (to.name === 'Setting' || to.name === 'AddPost' || to.name === 'EditPost') {
      return next({name: 'Login'})
    }
    next()
  } else {
    if (to.name === 'Login' || to.name === 'Register') {
      return next({name: 'Posts'})
    }
    next()
  }
})

export default router
