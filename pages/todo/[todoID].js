import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState, useSyncExternalStore } from "react";
import { deleteItem, editItem, getItems, getTodo } from "../../utils/dataFetching";
import ItemForm from "../../components/itemForm";
import { EditStatItem } from "../../utils/editData";
import Link from "next/link";

const TodoItems = () => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemObj, setItemObj] = useState({});
  const [arrFilter, setArrFilter] = useState(["active", "completed", "undefine"]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const todoID = router.query.todoID ?? 1;
  const queryClient = useQueryClient();

  const [todoQuery, itemsQuery] = useQueries({
    queries: [
      { queryKey: ["todo", todoID], queryFn: () => getTodo(todoID) },
      { queryKey: ["items", todoID], queryFn: () => getItems(todoID) },
    ],
  });

  // *-----------------------------------
  // * ----------- MUTATION -------------

  const editStatItemMutation = useMutation({
    mutationFn: (itemData) => editItem(todoID, itemData.id, itemData),
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemID) => deleteItem(todoID, itemID),
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });

  if (todoQuery.isLoading || itemsQuery.isLoading)
    return (
      <span className="loading loading-dots loading-lg  my-10 mx-auto flex justify-center text-primary"></span>
    );

  const { data: todo } = todoQuery;
  const { data: items } = itemsQuery;

  // *-----------------------------------
  // * ----------- FILTER DATA -------------

  EditStatItem(items);
  let filterItems = items.filter((item) => arrFilter.includes(item.status));
  if (search.length > 0)
    filterItems = filterItems.filter(
      (item) => item.title.toLowerCase().search(search.toLowerCase()) >= 0
    );

  const filterHandle = (filterName) => {
    if (arrFilter.includes(filterName)) {
      setArrFilter(arrFilter.filter((name) => name !== filterName));
    } else {
      setArrFilter([...arrFilter, filterName]);
    }
  };

  // *-----------------------------------
  // * ----------- DESIGN -------------

  const statusDsgn = {
    active: "bg-orange-200",
    completed: "bg-green-200",
    undefine: "bg-gray-200",
  };

  // *-----------------------------------
  // * ----------- RETURN -------------

  return (
    <div className="p-2">
      {isOpenForm && (
        <ItemForm
          todoID={todoID}
          onClose={() => {
            setIsOpenForm(false);
            setItemObj({});
          }}
          itemObj={itemObj}
        />
      )}
      <div className="flex justify-between">
        <span className="text-xl font-bold">{`${todo.title}`}</span>
        <Link href={"/"}>
          <button className="btn btn-xs font-light">back</button>
        </Link>
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="btn-sm border rounded-lg font-semibold bg-blue-200 hover:bg-blue-300"
          onClick={() => {
            setIsOpenForm(true);
          }}
        >
          Add item
        </button>

        <div className="join font-semibold">
          <button
            className={`join-item border btn-sm ${
              arrFilter.includes("active")
                ? "bg-orange-200 hover:bg-orange-300"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => filterHandle("active")}
          >
            Active
          </button>
          <button
            className={`join-item border btn-sm ${
              arrFilter.includes("completed")
                ? "bg-green-200 hover:bg-green-300"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => filterHandle("completed")}
          >
            Completed
          </button>
        </div>
        <div>
          <input
            maxLength={50}
            placeholder="Find item"
            type="search"
            className="input input-bordered input-sm focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="divider mt-2"></div>
      {filterItems.map((item) => (
        <div className="border rounded my-2 p-2 shadow" key={item.id}>
          <div className="flex justify-between items-baseline mb-2 gap-4">
            <div className="space-x-2 items-baseline flex flex-nowrap">
              <select
                className={`select select-sm focus:outline-none ${statusDsgn[item.status]}`}
                value={item.status}
                placeholder="---"
                onChange={(e) => {
                  const status = e.target.value;
                  const newItem = { ...item, status: status };
                  editStatItemMutation.mutate(newItem);
                }}
              >
                <option value="undefine" hidden>
                  Undefine
                </option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <span className="font-bold text-md">{item.title}</span>
            </div>
            <div className="space-x-4 items-baseline flex flex-nowrap">
              {/* EDIT button */}
              <button
                className="text-gray-400 hover:text-blue-500"
                onClick={() => {
                  setItemObj(item);
                  setIsOpenForm(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                className="text-gray-400 hover:text-red-400"
                onClick={() => {
                  if (confirm(`Do you want to delete ${item.title} item?`)) {
                    deleteItemMutation.mutate(item.id);
                  }
                }}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
          <hr />
          <div>{item.text}</div>
          <div
            className={`text-right italic ${
              new Date(item.deadline) < new Date() && item.status === "active"
                ? "text-red-600"
                : "text-gray-400"
            }`}
          >
            <span>{new Date(item.deadline).toLocaleString("sk-SK", { dateStyle: "short" })}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoItems;
