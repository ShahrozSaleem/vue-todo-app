<template>
  <div class="container">
    <el-autocomplete
      class="search-bar"
      v-model="query"
      :fetch-suggestions="getSuggestions"
      placeholder="Search TODO by title"
      clearable
      @select="searchTodos(query)"
      @clear="searchTodos('')"
    >
      <template #append>
        <el-button
          icon="el-icon-search"
          @click="searchTodos(query)"
        ></el-button>
      </template>
      <template v-slot="data">
        {{ data.item.title }} ({{ data.item.id }})
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import api from "../apis";

export default {
  name: "SearchBar",

  emits: ["searched", "onError"],

  data() {
    return {
      query: ""
    };
  },

  methods: {
    getSuggestions(query, cb) {
      if (query) {
        api
          .searchItems(query)
          .then((res) => {
            if (res && res.data && res.data.success) cb(res.data.items.data);
            else cb([]);
          })
          .catch((err) => {
            console.error(err);
            cb([]);
            this.$emit("onError", err);
          });
      } else cb([]);
    },

    searchTodos(query) {
      this.$emit("searched", query);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 700px;
  min-width: 250px;
  padding: 0px;
}
</style>

<style>
.el-autocomplete.search-bar {
  width: 100%;
  padding: 0px 5px;
}
</style>
