import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loading, error } = useSelector((state) => state.auth);
  const { login, token, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-base-200 py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Login</h2>
              <p className="mt-2 text-sm">
                Masuk untuk melanjutkan ke BantuBanjir
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium ">Email</label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan email anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium ">Password</label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? "Memuat..." : "Masuk"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Atau</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Daftar Akun Baru
                </a>
              </div>
            </div>

            <div className="mt-6">
              {error && <p className="text-error">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
