import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, getTodos } from "../utils/dataFetching";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  // const refNewTodo = useRef();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [search, setSearch] = useState("");

  const { status, data: todosList } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(),
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => addTodo(newTodo),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["todos"]);
      router.push(`/todo/${data.id}`);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoID) => deleteTodo(todoID),
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const onSubmitAddTodo = (e) => {
    e.preventDefault();
    const title = newTodoTitle;
    addTodoMutation.mutate({ title: title });
    setNewTodoTitle("");
  };

  if (status === "loading")
    return (
      <span className="loading loading-dots loading-lg  my-10 mx-auto flex justify-center text-primary"></span>
    );

  todosList.sort((a, b) => (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1));

  let filterList = [...todosList];

  if (search !== "") {
    filterList = todosList.filter(
      (item) => item.title.toLowerCase().search(search.toLowerCase()) >= 0
    );
  }

  return (
    <div className="p-2">
      <div className="my-6 flex justify-between">
        <form className="space-x-2 " onSubmit={onSubmitAddTodo}>
          <input
            className="input input-bordered input-sm w-64 focus:outline-none font-semibold"
            onChange={(e) => setNewTodoTitle(e.target.value)}
            value={newTodoTitle}
            type="text"
          />
          <button
            className="btn btn-success btn-sm"
            type="submit"
            disabled={newTodoTitle.length > 0 ? false : true}
          >
            Add todo list
          </button>
        </form>
        <input
          className="input input-bordered input-sm max-w-xs focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Find todo"
          type="search"
        />
      </div>
      <div className="divider my-2"></div>
      {filterList.map((item) => (
        <div key={item.id} className="border rounded my-2 p-2 flex justify-between shadow-sm gap-2">
          <Link className="w-max flex-grow" href={`/todo/${item.id}`}>
            <h4 className="font-semibold   hover:font-bold ">{item.title}</h4>
          </Link>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => {
              let text = "Will you delete this todo list?";
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
      ))}
    </div>
  );
}
