import React from "react";
import { useForm } from "react-hook-form";

const HookForm = () => {
  const form = useForm({ defaultValues: { username: "Batman", email: "", channel: "" } });
  const { register, handleSubmit, formState } = form;

  const { errors } = formState;

  let tlacidlo = "";

  const onSubmit = (data, e) => {
    console.log("Form submited");
    console.log(data);
    console.log(e);
    console.log("tlacidlo name", tlacidlo);
  };

  // return <div>Ahoj</div>;

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col border py-6 px-20 "
      >
        <label>Username</label>
        <input
          className="input border-gray-400 input-sm mb-4"
          id="username"
          {...register("username", { required: "Username is required" })}
        />
        <p>{errors.username?.message}</p>

        <label>E-mail</label>
        <input
          id="email"
          {...register("email", {
            pattern: { value: /^[A-Za-z]+$/i, message: "email nie je platny" },
            validate: (fieldValue) => {
              return fieldValue !== "admin@mail.com" || "Enter a different email";
            },
          })}
          type="text"
          className="input  border-gray-400  input-sm mb-4"
        ></input>
        <p>{errors.email?.message}</p>

        <label>Channel</label>
        <input
          id="channel"
          {...register("channel")}
          className="input  border-gray-400  input-sm mb-4"
        ></input>

        <button
          type="submit"
          className="btn"
          onClick={() => {
            tlacidlo = "ADD";
          }}
        >
          Submit
        </button>
        <button
          type="button" // ak to nie je definovane, je to submit
          className="btn"
          onClick={() => {
            tlacidlo = "AddAndCLose";
            console.log("Add and close");
          }}
        >
          Add and close
        </button>
      </form>
    </div>
  );
};

export default HookForm;
