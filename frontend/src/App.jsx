import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FuturisticInterface from "./components/FuturisticInterface";
import { NeuronsProvider } from "./components/NeuronsSystem";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <NeuronsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<FuturisticInterface />} />
          </Routes>
        </HashRouter>
        <Toaster />
      </NeuronsProvider>
    </div>
  );
}

export default App;