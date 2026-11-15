import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FuturisticInterface from "./components/FuturisticInterface";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<FuturisticInterface />} />
        </Routes>
      </HashRouter>
      <Toaster />
    </div>
  );
}

export default App;
