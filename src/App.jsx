import "./App.css";
import Home from "lucide-react";
import Homepage from "./welcomePage/Welcome";
import UserDashboard from "./home/UserDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
