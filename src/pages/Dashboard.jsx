import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import {
  MapPin,
  AlertTriangle,
  Users,
  BarChart2,
  Plus,
  Menu,
} from "lucide-react";
import ReportForm from "../components/ReportForm";

const Dashboard = ({ reports, totalUser }) => {
  const { isAuthenticated } = useAuth();
  const navigator = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to={"/login"} />;
  }

  const closeModal = () => {
    document.getElementById("reportModal").close();
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg">
          <div className="flex items-center p-4 border-b">
            <button
              onClick={() => navigator("/")}
              className="text-xl font-bold text-blue-600"
            >
              BantuBanjir
            </button>
          </div>

          <nav className="p-4">
            <div className="space-y-2 ">
              <a
                className={`flex items-center p-3 text-gray-700 rounded-lg bg-blue-50`}
              >
                <BarChart2 className="w-5 h-5 mr-3" />
                Dashboard
              </a>
              <Link
                to={"/reports"}
                className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50"
              >
                <AlertTriangle className="w-5 h-5 mr-3" />
                Laporan
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Overview laporan banjir terkini</p>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => document.getElementById("reportModal").showModal()}
            >
              <Plus className="w-5 h-5 mr-2" />
              Buat Laporan
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Laporan</p>
                  <h3 className="text-2xl font-bold text-gray-800">{reports.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Pengguna</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalUser}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Laporan Terbaru
            </h2>
            <div className="space-y-4">
              {reports.map((item, key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg">
                      <img src={item.imageUrl} alt={item.description} />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-black">
                        {item.description}
                      </h1>
                      <h3 className="font-medium text-gray-800">{item.desc}</h3>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm text-yellow-700 bg-yellow-50 rounded-full">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>

          <dialog id="reportModal" className="modal">
            <ReportForm closeModal={closeModal} />
          </dialog>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
