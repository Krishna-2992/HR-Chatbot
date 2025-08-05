import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import UploadJob from "./pages/UploadJob";
import Jobs from "./pages/Jobs";
import UploadPDF from "./pages/UploadPDF";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload-job" element={<UploadJob />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/upload-resume" element={<UploadPDF />} />
      </Routes>
    </div>
  );
}

export default App;
