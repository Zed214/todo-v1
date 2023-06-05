import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editTodo } from "../utils/dataFetching";

export default function TodoForm({ objTodo, onClose }) {
  const queryClient = useQueryClient();

  let [isOpen, setIsOpen] = useState(true);

  const form = useForm({ defaultValues: objTodo });
  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  const editItemMutation = useMutation({
    mutationFn: (todoData) => editTodo(objTodo.id, todoData),
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const onSubmit = (data) => {
    editItemMutation.mutate(data);
    onClose();
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                    Edit ToDo
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

                    <div className="flex justify-between gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning flex-grow"
                        onClick={() => onClose()}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm btn-success flex-grow"
                        // onClick={() => ()}
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
