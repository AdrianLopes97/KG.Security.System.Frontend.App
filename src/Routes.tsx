import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/protected-route";
import { Navigate, Route, Routes } from "react-router";
import Sidebar from "./components/layout/sidebar-project";
import { CreateProject } from "./pages/Create-Project";
import { EditProject } from "./pages/Edit-Project";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

export function Router() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Sidebar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
