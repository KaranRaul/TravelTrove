import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import { Destinations } from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import CreateDestination from "./pages/CreateDestination";
import CreateItinerary from "./pages/CreateItinerary";
import ViewItinerary from "./pages/ViewItinerary";
import MyItineraries from "./pages/MyItineraries";
import EditItinerary from "./pages/EditItinerary";
import EditDestination from "./pages/EditDestination";
import Favorites from "./pages/Favorite";
import Chat from "./pages/Chat";
import Groups from "./pages/Groups/Groups";
import CreateGroup from "./pages/Groups/CreateGroup";
import GroupDetails from "./pages/Groups/GroupDetails";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/destinations/create" element={<AdminRoute />}>
            <Route path="" element={<CreateDestination />} />
          </Route>
          <Route path="/destinations/edit/:id" element={<AdminRoute />}>
            <Route path="" element={<EditDestination />} />
          </Route>
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

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />


          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />

          <Route
            path="/groups/create"
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/groups/:id"
            element={
              <ProtectedRoute>
                <GroupDetails />
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
