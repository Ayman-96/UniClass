import "./App.css";
import HomePage from "./home/Homepage";
import Welcome from "./welcomePage/Welcome";
import UserDashboard from "./home/UserDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<HomePage />}>
            {/* Nested for Menu Section */}
            <Route path="dashboard" element={UserDashboard} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
