import "./App.css";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Homepage from "./Homepage";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
