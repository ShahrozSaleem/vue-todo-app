<template>
  <div class="container" v-if="todo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>
            {{ todo.title }}
          </span>
          <span class="spacer"></span>
          <el-button class="button" type="text" @click="openUpdateDialog">
            Update
          </el-button>
          <el-button class="button" type="text" @click="deleteTodo">
            Delete
          </el-button>
        </div>
      </template>
      <div class="text item">
        {{ todo.description }}
      </div>
    </el-card>
    <el-dialog title="Update Todo" v-model="dialogFormVisible">
      <el-form :model="updateForm" ref="updateForm">
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
            v-model="updateForm.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> Cancel </el-button>
          <el-button @click="resetForm('updateForm')"> Reset </el-button>
          <el-button type="primary" @click="updateTodo('updateForm')">
            Update Description
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../apis";

export default {
  name: "TodoItem",

  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogFormVisible: false,
      updateForm: {
        description: this.todo.description
      }
    };
  },

  methods: {
    openUpdateDialog() {
      this.updateForm.description = this.todo.description;
      this.dialogFormVisible = true;
    },

    updateTodo(formName) {
      this.$refs[formName].validate((valid) => {
        if (
          valid &&
          this.todo &&
          this.updateForm &&
          this.updateForm.description
        ) {
          api
            .updateItem(this.todo.id, this.updateForm.description)
            .then((res) => {
              if (res && res.data && res.data.success) {
                this.$message({
                  type: "success",
                  showClose: true,
                  message: 'Successfully updated "' + this.todo.title + '"'
                });
                this.$emit("onUpdate", {
                  title: this.todo.title,
                  description: this.updateForm.description,
                  id: this.todo.id
                });
                this.dialogFormVisible = false;
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
              this.$emit("onError", err);
            });
        } else return false;
      });
    },

    deleteTodo() {
      if (this.todo) {
        this.$confirm(
          "Are you sure you want to delete this todo?",
          this.todo.title,
          {
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          api
            .deleteItem(this.todo.id)
            .then((res) => {
              if (res && res.data && res.data.success) {
                this.$message({
                  type: "success",
                  showClose: true,
                  message: 'Successfully deleted "' + this.todo.title + '"'
                });
                this.$emit("onDelete", this.todo.id);
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message({
                type: "error",
                showClose: true,
                message: 'Unable to delete "' + this.todo.title + '"'
              });
              this.$emit("onError", err);
            });
        });
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  min-width: 250px;
  width: 100%;
}

.box-card {
  width: 100%;
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  padding: 3px 10px;
}

.spacer {
  width: 100%;
  margin: auto;
  flex: 1;
}
</style>

<style>
.box-card .el-card__header {
  padding: 0px;
}

.box-card .el-card__body {
  padding: 10px;
}
</style>
