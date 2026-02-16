import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import "./input.css";
import "./lib/firebase";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App/>
    </StrictMode>
);
