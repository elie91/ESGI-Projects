import React from "react";

const Input = ({ label, name, onChange, autoComplete, className, value, error = undefined }) => {

  return (
    <div className={"form-group " + className }>
      <label htmlFor={name}>{label}</label>
      <input onChange={onChange} type="text" placeholder={label} autoComplete={autoComplete} name={name}
             id={name} className="form-control" value={value}/>
      {error !== undefined ? error[name] !== undefined && <div className="invalid-feedback show">{error[name]}</div> : ""}

    </div>
  );

};

export default React.memo(Input);
