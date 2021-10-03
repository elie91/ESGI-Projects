import React from "react";

const generateArray = (length) => {
  let array = [];
  for (let i = 0; i < length; i++){
    array[i] = i;
  }
  return array;
}

const SpinLoader = () => {

  return (
    <div className="sk-chase">
      {generateArray(6).map((value, index) => <div key={index} className="sk-chase-dot"/>)}
    </div>
  );
};

export default SpinLoader;
