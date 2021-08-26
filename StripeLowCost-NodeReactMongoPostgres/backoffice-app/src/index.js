import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {RootProvider} from './context/RootContext';
import * as serviceWorker from './serviceWorker';
//import 'bootstrap/dist/css/bootstrap.css';
import './css/bo.min.css';
import './css/fontawesome-free/css/all.min.css';
//import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <React.StrictMode>
        <RootProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </RootProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
