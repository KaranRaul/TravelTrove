import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Chat from "./pages/Chat";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Destinations } from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import CreateItinerary from "./pages/CreateItinerary";
import ViewItinerary from "./pages/ViewItinerary";
import MyItineraries from "./pages/MyItineraries";
import EditItinerary from "./pages/EditItinerary";
import Favorites from "./pages/Favorite";
import Chat from "./pages/Chat";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route
            path="/itinerary/create"
            element={
              <ProtectedRoute>
                <CreateItinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-itineraries"
            element={
              <ProtectedRoute>
                <MyItineraries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary/edit/:id"
            element={
              <ProtectedRoute>
                <EditItinerary />
              </ProtectedRoute>
            }
          />
          import Favorites from "./pages/Favorites";

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          import Chat from "./pages/Chat";

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />



          <Route path="/itinerary/:id" element={<ViewItinerary />} />

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
