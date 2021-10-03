import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: 'GTM-MLFCWSK'
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render(
  <Suspense fallback="loading">
    <App/>
  </Suspense>
  , document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
