<template>
  <div class="wrapper-center">
    <h1 class="title">Register</h1>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="registration-form"
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
      <el-form-item label="Password" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Confirm" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="actions">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="processing"
        >
          Register
        </el-button>
        <el-button @click="resetForm('ruleForm')" :disabled="processing">
          Reset
        </el-button>
        <el-button @click="openLogin" :disabled="processing">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "../apis";
import { getAuthToken } from "../utils/util.helper";

export default {
  name: "RegistrationPage",

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Password does not match!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        email: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur", required: true }],
        checkPass: [
          { validator: validatePass2, trigger: "blur", required: true }
        ]
      },
      processing: false,
      isLoggedIn: false
    };
  },

  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) this.$router.push("/");
    }
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
            .register(
              this.ruleForm.email,
              this.ruleForm.pass,
              this.ruleForm.checkPass
            )
            .then((res) => {
              this.processing = false;
              if (res && res.data && res.data.success) {
                this.resetForm(formName);
                this.$router.push("/login");
              } else {
                console.error("Empty response");
                this.$message({
                  message:
                    res.data && res.data.message
                      ? res.data.message
                      : "Something went wrong.",
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

    openLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.registration-form {
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
