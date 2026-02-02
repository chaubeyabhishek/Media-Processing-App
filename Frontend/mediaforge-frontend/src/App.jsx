import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageProcessorLanding from "./Pages/ImageProcessorLanding";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Pricing from "./Pages/Pricing";
import Dashboard from "./Pages/Dashboard";
import Compress from "./Pages/compress";
function App() {
  return (
      <div>
      <Routes>
        <Route path="/" element={<ImageProcessorLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/pricing" element={<Pricing/>}></Route>
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
        <Route path="/compress" element={<Compress/>}></Route>
      </Routes>
      </div>

  );
}

export default App;
