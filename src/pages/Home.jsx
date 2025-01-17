import { ArrowRight, AlertCircle, MapPin, Users } from "lucide-react";
import Navbar from "../components/Navbar";

import ReportCard from "../components/ReportCard";
import { motion } from "motion/react";

export default function Home({ totalUser, reports }) {
  const getTotalReports = (status) => {
    let totalReports = 0;

    reports.forEach((report) => {
      const activeLocation = report.status === status;
      if (activeLocation) {
        totalReports++;
      }
    });

    return totalReports;
  };

  const extractMainAreas = reports.map((item) => {
    const locationParts = item.location.split(",");
    // Mencari bagian yang berisi nama daerah (biasanya setelah RW/RT atau nama jalan)
    const mainArea = locationParts.find((part) => {
      part = part.trim().toLowerCase();
      // Mengabaikan bagian yang mengandung RT/RW/Jalan dan mengambil nama daerah
      return (
        !part.includes("rt") &&
        !part.includes("rw") &&
        !part.includes("jalan") &&
        !part.includes("menara") &&
        part !== "java" &&
        !part.includes("indonesia")
      );
    });

    return mainArea ? mainArea.trim() : "";
  });

  const mainAreas = extractMainAreas.filter((area) => area !== "");

  return (
    <>
      <div className="landing-page min-h-screen">
        <Navbar />

        <div className="hero min-h-screen bg-bg-hero">
          <div className="w-full h-full flex justify-center bg-black/50">
            <div className="hero-content text-center max-w-3/4">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-bold">
                  Laporkan Banjir Disekitarmu
                </h1>
                <p className="py-6">
                  Platform pelaporan banjir real-time untuk membantu masyarakat
                  dan petugas tanggap bencana bertidak lebih cepat
                </p>
                <button className="btn btn-primary">
                  Mulai Sekarang <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-page-information w-full flex justify-evenly items-center bg-white py-12">
          <div className="landing-page-stats flex flex-col gap-2 items-center">
            <AlertCircle className="w-12 h-12 text-blue-500" />

            <h3 className="font-bold text-2xl text-black">
              {getTotalReports("ACTIVE")}
            </h3>
            <small className="text-gray-600">Laporan Aktif</small>
          </div>
          <div className="landing-page-stats flex flex-col gap-2 items-center ">
            <MapPin className="w-12 h-12 text-blue-500" />

            <h3 className="font-bold text-2xl text-black">
              {getTotalReports("RESOLVED")}
            </h3>
            <small className="text-gray-600">Laporan Terselesaikan</small>
          </div>
          <div className="landing-page-stats flex flex-col gap-2 items-center ">
            <Users className="w-12 h-12 text-blue-500" />

            <h3 className="font-bold text-2xl text-black">{totalUser}</h3>
            <small className="text-gray-600">Jumlah User</small>
          </div>
        </div>
      </div>

      {/* Reports Card */}

      <div className="card-wrapper w-full py-12 px-8 bg-base-200 overflow-hidden">
        <h1 className="font-bold text-3xl mb-12">Laporan Banjir</h1>
        <motion.div
          drag="x"
          dragConstraints={{ left: -500, right: 0 }}
          className="flex n gap-8"
        >
          {reports.map((data, key) => {
            console.log(data)
            return (
              <div key={key}>
                <ReportCard
                  imageUrl={data.imageUrl}
                  desc={data.description}
                  waterLevel={data.waterLevel}
                  location={mainAreas[key]}
                  user={data.user?.name}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
