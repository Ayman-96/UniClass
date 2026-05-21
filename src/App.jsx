import "./App.css";
import Homepage from "./home/Homepage";
import Welcome from "./welcomePage/Welcome";
import UserDashboard from "./home/menuContents/UserDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Homepage />}>
            {/* Nested routes for the outlet */}
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="notifications" element={<UserDashboard />} />
            <Route path="classmates" element={<UserDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
