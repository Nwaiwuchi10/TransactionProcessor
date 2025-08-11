import "./App.css";
import { Route, Routes } from "react-router-dom";
// import DashboardBody from "./dashboard/DashboardBody";
import CreateCreativeProduct from "./components/CreateProduct/CreateProduct";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* <Route path="/" element={<DashboardBody />} /> */}
          <Route path="/" element={<CreateCreativeProduct />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
