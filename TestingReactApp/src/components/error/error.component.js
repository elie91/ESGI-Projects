import React from "react";

const Error = ({error}) => (
  <div className='container'>
    {console.log(error)}
    <div className='alert alert-danger'>{error}</div>
  </div>
)

export default Error;
