import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./home/Homepage";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Dashbord" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
