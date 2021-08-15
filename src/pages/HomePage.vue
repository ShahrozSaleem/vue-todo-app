<template>
  <div class="wrapper">
    <div class="container" v-if="isLoggedIn">
      <el-button type="success" class="create-btn" @click="openCreateDialog">
        Created Todo
      </el-button>
      <search-bar @searched="searchTodos" @onError="handleLogout" />
      <template v-if="todos && todos.length">
        <todo-item
          v-for="todo of todos"
          :key="todo.id"
          :todo="todo"
          @onUpdate="updateTodo"
          @onDelete="removeTodo"
          @onError="handleLogout"
        />
      </template>
      <template v-else>
        <h2 class="no-items">No Data Found</h2>
      </template>
    </div>
    <welcome-screen v-else />
    <el-dialog title="Create Todo" v-model="createDialogVisible">
      <el-form :model="createForm" ref="createForm">
        <el-form-item
          label="Title"
          prop="title"
          label-width="100px"
          :rules="[
            {
              required: true,
              message: 'Please input todo Title',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="createForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="Description"
          prop="description"
          label-width="100px"
          :rules="[
            {
              required: true,
              message: 'Please input description',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="createForm.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false"> Cancel </el-button>
          <el-button @click="resetForm('createForm')"> Reset </el-button>
          <el-button type="primary" @click="createTodo('createForm')">
            Create Todo
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../apis";
import SearchBar from "../components/SearchBar.vue";
import TodoItem from "../components/TodoItem.vue";
import WelcomeScreen from "../components/WelcomeScreen.vue";
import { getAuthToken, removeAuthToken } from "../utils/util.helper";

export default {
  name: "HomePage",

  components: {
    SearchBar,
    TodoItem,
    WelcomeScreen
  },

  data() {
    return {
      totalPages: 1,
      page: 1,
      allTodos: [],
      searchedTodos: [],
      visibleTodos: "all",
      isLoggedIn: false,
      loadingObj: null,
      createDialogVisible: false,
      createForm: {
        title: "",
        description: ""
      },
      processing: false,
      listening: false
    };
  },

  computed: {
    todos() {
      return this.visibleTodos === "all" ? this.allTodos : this.searchedTodos;
    }
  },

  created() {
    this.loadingObj = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "white",
      visible: true
    });

    const token = getAuthToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      api.setToken(token);
      this.addListener();
      this.getTodos();
    } else this.loadingObj.close();
  },

  methods: {
    addListener() {
      this.listening = true;
      window.addEventListener("scroll", this.listener);
    },

    removeListener() {
      this.listening = false;
      window.removeEventListener("scroll", this.listener);
    },

    listener() {
      const {
        scrollHeight,
        scrollTop,
        clientHeight
      } = document.documentElement;
      if (scrollTop + clientHeight > scrollHeight - 5) {
        if (!this.processing) this.getTodos();
      }
    },

    searchTodos(query) {
      if (query) {
        this.visibleTodos = "searched";
        api
          .searchItems(query)
          .then((res) => {
            if (res && res.data && res.data.success)
              this.searchedTodos = res.data.items.data || [];
            else this.searchedTodos = [];
          })
          .catch((err) => {
            console.error(err);
            this.searchedTodos = [];
            this.handleLogout(err);
          });
      } else this.visibleTodos = "all";
    },

    getTodos() {
      if (!this.listening) this.addListener();
      this.processing = true;
      if (this.page <= this.totalPages) {
        api
          .getItems(this.page)
          .then((res) => {
            if (res && res.data && res.data.success) {
              this.page++;
              this.totalPages = res.data.items.last_page;
              this.allTodos = this.allTodos.concat(res.data.items.data || []);
            }
            this.processing = false;
            this.loadingObj.close();
          })
          .catch((err) => {
            this.processing = false;
            this.loadingObj.close();
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
            this.handleLogout(err);
          });
      } else {
        this.removeListener();
        this.loadingObj.close();
        this.processing = false;
      }
    },

    updateTodo(updatedTodo) {
      if (this.visibleTodos === "all") {
        const index = this.allTodos.findIndex(
          (obj) => obj.id === updatedTodo.id
        );
        if (index != -1)
          this.allTodos[index].description = updatedTodo.description;
      } else {
        const index = this.searchedTodos.findIndex(
          (obj) => obj.id === updatedTodo.id
        );
        if (index != -1)
          this.searchedTodos[index].description = updatedTodo.description;
      }
    },

    removeTodo(id) {
      if (this.visibleTodos === "all") {
        const index = this.allTodos.findIndex((obj) => obj.id === id);
        if (index != -1) this.allTodos.splice(index, 1);
      } else {
        const index = this.searchedTodos.findIndex(
          (obj) => obj.id === updatedTodo.id
        );
        if (index != -1) this.searchedTodos.splice(index, 1);
      }
    },

    handleLogout(err) {
      if (err && err.response && err.response.status === 401) {
        removeAuthToken();
        this.resetData();
      }
    },

    resetData() {
      this.isLoggedIn = false;
      this.page = 1;
      this.allTodos = [];
      this.totalPages = 1;
      this.searchedTodos = [];
      this.visibleTodos = "all";
    },

    openCreateDialog() {
      this.createForm = {
        title: "",
        description: ""
      };

      this.createDialogVisible = true;
    },

    createTodo(formName) {
      this.$refs[formName].validate((valid) => {
        if (
          valid &&
          this.createForm &&
          this.createForm.title &&
          this.createForm.description
        ) {
          api
            .createItem(this.createForm.title, this.createForm.description)
            .then((res) => {
              if (res && res.data && res.data.success) {
                this.$message({
                  type: "success",
                  showClose: true,
                  message:
                    'Successfully created "' + this.createForm.title + '"'
                });
                this.page = 1;
                this.totalPages = 1;
                this.allTodos = [];
                this.getTodos();
                this.createDialogVisible = false;
              } else {
                this.$message({
                  type: "error",
                  showClose: true,
                  message: 'Unable to update "' + this.todo.title + '"'
                });
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message({
                type: "error",
                showClose: true,
                message:
                  err &&
                  err.response &&
                  err.response.data &&
                  err.response.data.error
                    ? err.response.data.error instanceof Array
                      ? err.response.data.error[0]
                      : err.response.data.error
                    : "Something went wrong"
              });
              this.handleLogout(err);
            });
        } else return false;
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px 10px;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.no-items {
  color: grey;
}

.create-btn {
  margin: 10px;
}
</style>
