import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { addItem, editItem } from "../utils/dataFetching";
import { dateStrFormat } from "../utils/editData";
import { useForm } from "react-hook-form";
import _ from "lodash";

export default function ItemForm({ todoID, itemObj, onClose }) {
  const queryClient = useQueryClient();

  const isEditMode = !_.isEmpty(itemObj);

  const initFormValues = {
    title: "",
    text: "",
    deadline: new Date(),
  };

  const form = useForm({ defaultValues: isEditMode ? itemObj : initFormValues });
  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  //* ---- MUTATION ------

  const addItemMutation = useMutation({
    mutationFn: (itemData) => addItem(todoID, itemData),
    onSuccess: () => {
      reset(initFormValues);
      queryClient.invalidateQueries("items");
    },
  });

  const editItemMutation = useMutation({
    mutationFn: (itemData) => editItem(todoID, itemObj.id, itemData),
    onSuccess: () => {
      reset(initFormValues);
      queryClient.invalidateQueries("items");
    },
  });

  //* ---- HANDLERS ------

  let action = "";

  const onSubmit = (data) => {
    if (isEditMode) {
      if (action === "Edit_and_Close") {
        editItemMutation.mutate(data);
        onClose();
      }
    } else {
      if (action === "Add") {
        addItemMutation.mutate(data);
      }

      if (action === "Add_and_Close") {
        addItemMutation.mutate(data);
        onClose();
      }
    }
  };

  function closeModal() {
    onClose();
  }

  //* ---- RETURN ------

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 {}">
                    {isEditMode ? "Edit item" : "Add item"}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="my-2">
                      <div className="flex justify-between">
                        <span>Title:</span>
                        <span className="text-sm font-semibold text-red-500">
                          {errors.title?.message}
                        </span>
                      </div>
                      <input
                        maxLength={50}
                        type="text"
                        className="input input-bordered input-sm w-full font-bold focus:outline-2 focus:outline-gray-300"
                        {...register("title", { required: "Title is required" })}
                      />
                    </div>

                    <div className="my-2">
                      <div className="flex justify-between">
                        <span>Description:</span>
                        <span className="text-sm font-semibold text-red-500">
                          {errors.text?.message}
                        </span>
                      </div>
                      <textarea
                        maxLength={500}
                        className=" textarea textarea-bordered w-full h-64"
                        {...register("text", { required: "Description is required" })}
                      ></textarea>
                      <p className="text-sm justify-end flex text-gray-600">max 500 characters</p>
                    </div>

                    <div className="my-2">
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className="text-sm font-semibold text-red-500">
                          {errors.deadline?.message}
                        </span>
                      </div>
                      <input
                        type="date"
                        maxLength={500}
                        className="input textarea-bordered w-full focus:outline-gray-300 font-semibold"
                        // value={itemData.deadline}
                        {...register("deadline", {
                          required: "Deadline is required",
                          valueAsDate: true,
                        })}
                      ></input>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        className="btn btn-warning flex-grow"
                        onClick={() => closeModal()}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ display: isEditMode ? "none" : null }}
                        className="btn btn-success flex-grow"
                        onClick={() => (action = "Add")}
                      >
                        Add
                      </button>
                      <button
                        style={{ display: isEditMode ? "none" : null }}
                        type="submit"
                        className="btn btn-success flex-grow"
                        onClick={() => (action = "Add_and_Close")}
                      >
                        Add and close
                      </button>
                      <button
                        style={{ display: isEditMode ? null : "none" }}
                        type="submit"
                        className="btn btn-success flex-grow"
                        onClick={() => (action = "Edit_and_Close")}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
