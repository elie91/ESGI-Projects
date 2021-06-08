import React from "react";

const Form = ({ addList }) => {
  function onSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    addList(data);
  }

  return (
    <form onSubmit={onSubmit}>
      <label for="name">List name</label>
      <input id="name" type="text" placeholder="name" name="name"></input>
      <button type="submit">Add</button>
    </form>
  );
};

export default Form;
