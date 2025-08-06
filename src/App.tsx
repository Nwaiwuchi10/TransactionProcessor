import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashboardBody from "./dashboard/DashboardBody";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<DashboardBody />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
