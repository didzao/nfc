import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NFCPage from "./pages/NFC/index.";
import HomePage from "./pages/Home";
import QRCodePage from "./pages/QRCode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nfc" element={<NFCPage />} />
        <Route path="/qr-code" element={<QRCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
