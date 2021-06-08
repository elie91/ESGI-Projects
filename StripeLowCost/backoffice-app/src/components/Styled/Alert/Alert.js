import React, {useEffect} from "react";
import './Alert.scss';
const Alert = ({open, onDismiss, type, message}) => {

    useEffect(() => {
        let timeout;
        if (open) {
            timeout = setTimeout(() => {
                open && onDismiss();
            }, 2000);
        }
        return () => timeout && clearTimeout(timeout);
    }, [open]);

    return open && <div className={`alert alert-${type} alert-custom`}>{message}</div>
}

export default Alert;