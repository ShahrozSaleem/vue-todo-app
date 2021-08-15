import Axios from "axios";

function getItems(pageNum = 1) {
    return Axios.request({
        method: "GET",
        url: "/api/items",
        params: {
            page: pageNum
        }
    });
}

function searchItems(query) {
    return Axios.request({
        method: "GET",
        url: "/api/items",
        params: {
            q: query
        }
    });
}

function getItem(id) {
    return Axios.request({
        method: "GET",
        url: "/api/item/" + id
    });
}

function createItem(title, desc) {
    let formData = new FormData();
    formData.set("title", title);
    formData.set("description", desc);

    return Axios.request({
        method: "POST",
        url: "/api/item",
        data: formData
    });
}

function updateItem(id, desc) {
    return Axios.request({
        method: "PUT",
        url: "/api/item/" + id,
        data: {
            description: desc
        }
    });
}

function deleteItem(id) {
    return Axios.request({
        method: "DELETE",
        url: "/api/item/" + id
    });
}

const todoApi = {
    getItems,
    searchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
};

export default todoApi