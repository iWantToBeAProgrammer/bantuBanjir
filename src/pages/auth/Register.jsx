import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const { error, loading } = useSelector((state) => state.auth);
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-base-200 py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold ">Daftar Akun</h2>
              <p className="mt-2 text-sm ">
                Buat akun untuk mulai menggunakan BantuBanjir
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium ">
                  Nama Lengkap
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium ">Email</label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan email"
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
                    placeholder="Buat password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? "Memuat..." : "Daftar Sekarang"}
                  <ArrowRight
                    className={`ml-2 h-5 w-5 ${loading && "hidden"}`}
                  />
                </button>
              </div>

              <div className="mt-2">
                {error && <p className="text-error">{error}</p>}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm">
                Sudah punya akun?{" "}
                <a href="/login" className="font-medium hover:text-primary">
                  Login di sini
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
