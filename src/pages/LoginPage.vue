<template>
  <div class="wrapper-center">
    <h1 class="title">Login</h1>
    <el-form
      :model="ruleForm"
      status-icon
      ref="ruleForm"
      label-width="80px"
      class="login-form"
      label-position="left"
    >
      <el-form-item
        prop="email"
        label="Email"
        :rules="[
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item
        label="Password"
        prop="pass"
        :rules="[
          {
            required: true,
            message: 'Please input your password',
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="actions">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="processing"
        >
          Login
        </el-button>
        <el-button @click="resetForm('ruleForm')" :disabled="processing">
          Reset
        </el-button>
        <el-button @click="openRegister" :disabled="processing">
          Register
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "../apis";
import {
  setAuthToken,
  removeAuthToken,
  getAuthToken
} from "../utils/util.helper";

export default {
  name: "LoginPage",

  data() {
    return {
      ruleForm: {
        email: "",
        pass: ""
      },
      processing: false,
      isLoggedIn: false
    };
  },

  created() {
    this.isLoggedIn = !!getAuthToken();
    if (this.isLoggedIn) this.$router.push("/");
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.processing = true;
          api
            .login(this.ruleForm.email, this.ruleForm.pass)
            .then((res) => {
              this.processing = false;
              if (res && res.data && res.data.success) {
                setAuthToken(res.data.user.token);
                this.resetForm(formName);
                this.$emit("changed");
                this.$router.push("/");
              } else {
                removeAuthToken();
                console.error("Empty response");
                this.$message({
                  message: "Something went wrong.",
                  type: "error",
                  showClose: true
                });
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message({
                message:
                  err &&
                  err.response &&
                  err.response.data &&
                  err.response.data.error
                    ? err.response.data.error instanceof Array
                      ? err.response.data.error[0]
                      : err.response.data.error
                    : "Something went wrong",
                type: "error",
                showClose: true
              });
              this.processing = false;
            });
        } else return false;
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    openRegister() {
      this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 500px;
  height: auto;
  padding: 10px;
  margin: 10px;
}

.actions button {
  margin: 5px;
}
</style>
