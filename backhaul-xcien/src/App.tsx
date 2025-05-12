import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  return (
    <Routes>
      {/* Index Page */}
      <Route
        path="/"
        element={
          <DefaultLayout>
            <IndexPage />
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default App;
