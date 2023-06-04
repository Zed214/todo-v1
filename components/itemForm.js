import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { addItem, editItem } from "../utils/dataFetching";

export default function ItemForm({ todoID, itemObj, onClose }) {
  const queryClient = useQueryClient();

  const isEditMode = Object.entries(itemObj).length > 0;

  const initFormValues = {
    title: "",
    text: "",
    deadline: new Date(),
  };

  const [itemData, setItemData] = useState(isEditMode ? itemObj : initFormValues);

  //* ---- MUTATION ------

  const addItemMutation = useMutation({
    mutationFn: () => addItem(todoID, itemData),
    onSuccess: () => {
      setItemData(initFormValues);
      queryClient.invalidateQueries("items");
    },
  });

  const editItemMutation = useMutation({
    mutationFn: () => editItem(todoID, itemObj.id, itemData),
    onSuccess: () => {
      setItemData(initFormValues);
      queryClient.invalidateQueries("items");
    },
  });

  //* ---- HANDLERS ------

  const addHandle = () => {
    addItemMutation.mutate();
  };

  const addCloseHandle = () => {
    addItemMutation.mutate();
    onClose();
  };

  const editCloseHandle = () => {
    editItemMutation.mutate();
    onClose();
  };

  function closeModal() {
    setItemData(initFormValues);
    onClose();
  }

  function openModal() {}

  //! ---- RETURN ------

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
                  <div className="my-2">
                    <div>Title:</div>
                    <input
                      type="text"
                      className="input input-bordered input-sm w-full font-bold focus:outline-2 focus:outline-gray-300"
                      value={itemData.title}
                      onChange={(e) => {
                        setItemData({ ...itemData, title: e.target.value });
                      }}
                    />
                  </div>
                  <div className="my-2">
                    <div>Description:</div>
                    <textarea
                      maxLength={500}
                      className=" textarea textarea-bordered w-full h-64"
                      value={itemData.text}
                      onChange={(e) => {
                        setItemData({ ...itemData, text: e.target.value });
                      }}
                    ></textarea>
                    <p className="text-sm justify-end flex text-gray-700">max 500 characters</p>
                  </div>

                  <div className="my-2">
                    <div>Deadline:</div>
                    <input
                      type="date"
                      maxLength={500}
                      className="input textarea-bordered w-full focus:outline-gray-300 font-semibold"
                      value={itemData.deadline}
                      onChange={(e) => {
                        setItemData({ ...itemData, deadline: e.target.value });
                      }}
                    ></input>
                  </div>

                  <div className="divider"></div>

                  <div className="flex justify-between gap-2">
                    <button className="btn btn-warning flex-grow" onClick={() => closeModal()}>
                      Cancel
                    </button>
                    <button
                      style={{ display: isEditMode ? "none" : null }}
                      className="btn btn-success flex-grow"
                      onClick={() => addHandle()}
                    >
                      Add
                    </button>
                    <button
                      style={{ display: isEditMode ? "none" : null }}
                      type="submit"
                      className="btn btn-success flex-grow"
                      onClick={() => addCloseHandle()}
                    >
                      Add and close
                    </button>
                    <button
                      style={{ display: isEditMode ? null : "none" }}
                      type="submit"
                      className="btn btn-success flex-grow"
                      onClick={() => editCloseHandle()}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}