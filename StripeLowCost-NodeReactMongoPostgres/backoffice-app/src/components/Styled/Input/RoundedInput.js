import React from "react";

const RoundedInput = ({handleChange, parentClass, isUser, ...otherProps}) => {

    return (
        <div className={parentClass}>
            <input
                className={`form-control ${isUser ? 'form-control-user' : ''}`}
                onChange={handleChange}
                {...otherProps} />
        </div>
    )
}

export default React.memo(RoundedInput);