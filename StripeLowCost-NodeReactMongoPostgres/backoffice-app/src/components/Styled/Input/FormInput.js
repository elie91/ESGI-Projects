import React from "react";


const FormInput = ({parentClass, label, id, value, ...otherProps}) => {

    return (
        <div className={parentClass}>
            <label htmlFor={id}>{label}</label>
            <input className="form-control" type="text" value={value} id={id} {...otherProps}/>
        </div>
    )
}

export default React.memo(FormInput)