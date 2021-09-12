import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
// Routes for navigation
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/welcome",
    name: "welcome",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Startpage" */ "../views/Startpage.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue"),
  },
  {
    path: "/RequestTransport",
    name: "RequestTransport",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "RequestTransport" */ "../views/RequestTransport.vue"
      ),
  },
  {
    path: "/TransportHome",
    name: "TransportHome",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/TransportHome.vue"
      ),
  },
  {
    path: "/TransportInformation/:usern",
    name: "TransportInformation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/TransportInformation.vue"
      ),
    props: true,
  },

  {
    path: "/TransportManagerHome",
    name: "TransportManagerHome",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/TransportManagerHome.vue"
      ),
  },

  {
    path: "/TransportManagerInformation/:transport",
    name: "TransportManagerInformation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/TransportManagerInformation.vue"
      ),
    props: true,
  },
  {
    path: "/DepartmentInformation/:department_id",
    name: "DepartmentInformation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/DepartmentInformation.vue"
      ),
    props: true,
  },
  {
    path: "/AdminList",
    name: "AdminList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "TransportForms" */ "../views/AdminList.vue"),
    props: true,
  },
  {
    path: "/TransportList",
    name: "TransportList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "TransportForms" */ "../views/TransportList.vue"
      ),
    props: true,
  },
  {
    path: "/DepartmentsList",
    name: "DepartmentsList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "DepartmentsList" */ "../views/DepartmentsList.vue"
      ),
  },
  {
    path: "/UsersList",
    name: "UsersList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "UsersList" */ "../views/UsersList.vue"),
  },
  {
    path: "/Admin",
    name: "Admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Admin" */ "../views/Admin.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
