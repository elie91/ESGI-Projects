import React from 'react';

class ErrorBoundary extends React.Component {

    constructor() {
        super();
        this.state = {
            hasErrored: false
        }
    }

    /**
     * Catch any error that has thrown in any children of this component
     * https://stackoverflow.com/questions/52962851/whats-the-difference-between-getderivedstatefromerror-and-componentdidcatch
     * @param error
     */
    static getDerivedStateFromError(error) {
        //process the error
        return {hasErrored: true}
    }

    /**
     *
     * @param error
     * @param errorInfo
     */
    componentDidCatch(error, errorInfo) {
        console.error(error);
    }

    render() {
        if(this.state.hasErrored) {
            return (
                <div className="error-image-overlay">
                    <div className="error-image-container">
                    </div>
                    <h2 className="error-image-text">
                        Oups! Une erreur est survenue.
                    </h2>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;