<template>
  <div class="wrapper-center">
    <h1>Welcome</h1>
    <div class="actions">
      <el-button @click="$router.push('/login')">
        Login
      </el-button>
      <el-button @click="$router.push('/register')">
        Register
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomeScreen"
};
</script>

<style scoped></style>
