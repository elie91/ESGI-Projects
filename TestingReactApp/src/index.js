import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import ErrorBoundary from "./components/error-boundary/error-boundary";

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
