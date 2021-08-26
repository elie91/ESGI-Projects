import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { UserProvider } from "./context/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <UserProvider>
        <App/>
      </UserProvider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById("root"),
);

serviceWorker.register();
