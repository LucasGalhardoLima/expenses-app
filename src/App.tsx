import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { NoMatch } from "./pages/NoMatch";
import { Layout } from "./components/Layout";
import { Expenses } from "./pages/Expenses";
import { Income } from "./pages/Income";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/income" element={<Income />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Layout>
  );
}

export default App;
