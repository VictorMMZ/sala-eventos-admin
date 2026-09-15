import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminReservas from "./pages/AdminReservas";
import Finanzas from "./pages/Finanzas";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute user={true} />}>
          <Route path="/dashboard" element={<AdminReservas />} />
          <Route path="/finanzas" element={<Finanzas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
