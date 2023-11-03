import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DrawingToolsProvider } from "./Context/DrawingToolsContext";
import { HistoryProvider } from "./Context/History";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context/userProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserProvider>
      <HistoryProvider>
        <DrawingToolsProvider>
          <App />
        </DrawingToolsProvider>
      </HistoryProvider>
    </UserProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
