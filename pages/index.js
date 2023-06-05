import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteItem, deleteTodo, getItems, getTodos } from "../utils/dataFetching";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import TodoForm from "../components/todoForm";

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [objTodo, setObjTodo] = useState({});

  const [editTodo, setEditTodo] = useState({});

  const { status, data: todosList } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(),
  });

  // *-----------------------------------
  // * ----------- MUTATION -------------

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => addTodo(newTodo),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["todos"]);
      router.push(`/todo/${data.id}`);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoID) => {
      const todoItems = await getItems(todoID);

      for (const item of todoItems) {
        await deleteItem(todoID, item.id);
      }
      await deleteTodo(todoID);
    },
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  // *-----------------------------------
  // * ----------- ACTION -------------

  const onSubmitAddTodo = (e) => {
    e.preventDefault();
    const title = newTodoTitle;
    addTodoMutation.mutate({ title: title });
    setNewTodoTitle("");
  };

  if (status === "loading" || deleteTodoMutation.status === "loading")
    return (
      <div>
        <span className="loading loading-dots loading-lg  my-10 mx-auto flex justify-center text-primary"></span>
      </div>
    );

  // *-----------------------------------
  // * ----------- FILTER DATA -------------

  // todosList.sort((a, b) => (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1));
  todosList.sort((a, b) => b.id - a.id);

  let filterList = [...todosList];

  if (search !== "") {
    filterList = todosList.filter(
      (item) => item.title.toLowerCase().search(search.toLowerCase()) >= 0
    );
  }

  // *-----------------------------------
  // * ----------- RETURN -------------

  return (
    <div className="p-2">
      {isOpenForm && (
        <TodoForm
          objTodo={objTodo}
          onClose={() => {
            setIsOpenForm(false);
          }}
        />
      )}
      <div className="my-6 flex justify-between">
        <form className="space-x-2" onSubmit={onSubmitAddTodo}>
          <input
            maxLength={50}
            className="input input-bordered input-sm w-64 focus:outline-none font-semibold"
            onChange={(e) => setNewTodoTitle(e.target.value)}
            value={newTodoTitle}
            type="text"
          />
          <button
            className="btn bg-green-300 focus:bg-green-300 btn-sm"
            type="submit"
            disabled={newTodoTitle.length > 0 ? false : true}
          >
            Add
          </button>
        </form>
        <input
          maxLength={50}
          className="input input-bordered input-sm max-w-xs focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Find todo"
          type="search"
        />
      </div>
      <div className="divider my-2"></div>
      {filterList.map((item) => (
        <div
          key={item.id}
          className="border rounded my-2 p-2 h-10 flex justify-between shadow-sm gap-2"
        >
          <Link className="w-max flex-grow" href={`/todo/${item.id}`}>
            <h4 className="font-semibold   hover:font-bold ">{item.title}</h4>
          </Link>
          {_.isEmpty(editTodo) && (
            <div className="space-x-4">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6  text-gray-400 hover:text-blue-400"
                  onClick={() => {
                    setObjTodo(item);
                    setIsOpenForm(true);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>

              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  let text = `Do you want to delete ${item.title} todo list?`;
                  if (confirm(text) == true) {
                    deleteTodoMutation.mutate(item.id);
                  }
                }}
              >
                <svg
                  className="w-6 h-6 text-gray-400 hover:text-red-400 "
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
