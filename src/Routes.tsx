import { Route, Routes } from "react-router";
import App from "./App";

export function Router(){
    return (
        <Routes>
            <Route path="/" element={<App />} />
        </Routes>
    )
}