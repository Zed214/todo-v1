import axios from "axios";

const todoApi = axios.create({
  baseURL: "https://6476fa7e9233e82dd53aa166.mockapi.io",
});

//*----------- TODOS ------------

export const getTodos = async () => {
  const response = await todoApi.get("/todos");
  return response.data;
};

export const getTodo = async (todoID) => {
  const response = await todoApi.get(`/todos/${todoID}`);
  return response.data;
};

export const addTodo = async (newTodo) => {
  const response = await todoApi.post("/todos", newTodo);
  return response.data;
};

export const deleteTodo = async (todoID) => {
  const response = await todoApi.delete(`/todos/${todoID}`);
  return response.data;
};

//*----------- ITEMS ------------

export const getItems = async (todoID) => {
  const response = await todoApi.get(`/todos/${todoID}/item`);
  return response.data;
};

export const addItem = async (todoID, itemData) => {
  const response = await todoApi.post(`/todos/${todoID}/item`, itemData);
  return response.data;
};

export const editItem = async (todoID, itemID, itemData) => {
  const response = await todoApi.put(`/todos/${todoID}/item/${itemID}`, itemData);
  return response.data;
};

export const deleteItem = async (todoID, itemID) => {
  const response = await todoApi.delete(`/todos/${todoID}/item/${itemID}`);
  return response.data;
};
