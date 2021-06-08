import React, {useEffect} from "react";
import '../../sass/components/_flash-message.scss';


const FlashMessage = ({content}) => {

    useEffect(() => {
        const toast = document.querySelector('.custom-toast');
        toast.classList.add('custom-toast__show');
        setTimeout(() => {
            return toast.classList.remove('custom-toast__show')
        }, 3000);
    }, []);

    return (
        <div className="custom-toast" aria-hidden="false" role="alertdialog">
            <div className="custom-toast__body">
                <p className="custom-toast__text">
                    {content}
                </p>
            </div>
        </div>
    );
}

export default FlashMessage;
