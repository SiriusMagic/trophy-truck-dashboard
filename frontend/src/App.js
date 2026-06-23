import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FuturisticInterface from "./components/FuturisticInterface";
import { NeuronsProvider } from "./components/NeuronsSystem";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <NeuronsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FuturisticInterface />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </NeuronsProvider>
    </div>
  );
}

export default App;