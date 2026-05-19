import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./welcomePage/Welcome";
import UserDashboard from "./home/UserDashboard";
import { Home } from "lucide-react";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
