import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Chat from "./pages/Chat";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Destinations } from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          {/* <Route
            path="/chat"
            element={
              <ProtectedRoute>
              <Chat />
              </ProtectedRoute>
              }
              /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
