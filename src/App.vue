<template>
  <div class="container" v-if="!loading">
    <div id="nav">
      <router-link to="/"> Home </router-link>
      <template v-if="isLoggedIn">
        |
        <el-button class="logout-btn" type="text" @click="logout">
          Logout
        </el-button>
      </template>
      <template v-if="!isLoggedIn">
        | <router-link to="/login"> Login </router-link>
      </template>
      <template v-if="!isLoggedIn">
        | <router-link to="/register"> Register </router-link>
      </template>
    </div>
    <router-view @changed="updateStatus" />
  </div>
</template>

<script>
import api from "./apis";
import { getAuthToken, removeAuthToken } from "./utils/util.helper";

export default {
  name: "App",

  data() {
    return {
      loading: true,
      isLoggedIn: false
    };
  },

  created() {
    this.isLoggedIn = !!getAuthToken();
    this.loading = false;
  },

  methods: {
    updateStatus() {
      this.isLoggedIn = !!getAuthToken();
    },

    logout() {
      const token = getAuthToken();
      if (token) {
        api
          .logout(token)
          .then((res) => {
            if (res && res.data && res.data.success) {
              removeAuthToken();
              this.isLoggedIn = false;
            }
            this.$router.push("/login");
          })
          .catch((err) => {
            console.error(err);
            this.$message({
              message: "Unable to logout.",
              type: "error",
              showClose: true
            });
          });
      }
    }
  }
};
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
  background: #eee;
}

* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

#nav {
  position: fixed;
  width: 100%;
  height: 50px;
  background: #0099ff;
  box-shadow: 0 2px 4px -1px #222222;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  z-index: 100;
  top: 0px;
  left: 0px;
  padding: 0 20px;
  box-sizing: border-box;
}

#nav a {
  color: #eee;
  margin: 0 10px;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  font-weight: bold;
  color: white;
}

.wrapper-center {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-top: 50px;
}

.wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  margin-top: 50px;
}

.title {
  margin-bottom: 10px;
}

button.logout-btn {
  color: white;
  margin: 0 10px;
}

button.logout-btn:hover {
  color: white;
}
</style>
