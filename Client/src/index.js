import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DrawingToolsProvider } from "./Context/DrawingToolsContext";
import { HistoryProvider } from "./Context/History";
import { BrowserRouter } from "react-router-dom";
import { UserAndChatsProvider } from "./Context/userAndChatsProvider";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAndChatsProvider>
        <HistoryProvider>
          <DrawingToolsProvider>
            <App />
          </DrawingToolsProvider>
        </HistoryProvider>
      </UserAndChatsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
