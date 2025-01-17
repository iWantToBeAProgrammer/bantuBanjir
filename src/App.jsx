import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchReports } from "./redux/slices/reportSlice";
import axios from "axios";
import UserReports from "./pages/UserReports";

function App() {
  const dispatch = useDispatch();

  const { reports, loading, error } = useSelector((state) => state.reports);
  const [totalUser, setTotalUser] = useState(null);

  const getTotalUser = async () => {
    try {
      const response = await axios.get(
        "https://flood-app-api.vercel.app/api/reports/total-user"
      );
      const body = await response.data;
      setTotalUser(body);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchReports());
    getTotalUser();
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<Home totalUser={totalUser} reports={reports} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard reports={reports} totalUser={totalUser} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/reports"
              element={<UserReports reports={reports} />}
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
