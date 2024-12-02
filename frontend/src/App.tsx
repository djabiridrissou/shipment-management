import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Shipment from "./pages/Shipment";

const App = () => {

  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shipment" element={<Shipment />} />
      </Routes>
    </div>
  );
};

export default App;