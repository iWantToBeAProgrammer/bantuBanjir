import { ArrowLeft } from "lucide-react";
import ReportCardFull from "../components/ReportCardFull";

import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteReportThunk, selectReport } from "../redux/slices/reportSlice";
import ReportForm from "../components/ReportForm";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UserReports({ reports }) {
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to={"/login"} />;
  }

  const userReports = reports.filter((r) => r.userId === user.id);

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

  const selectedReport = useSelector((state) => state.reports.selectedReport);

  const handleEdit = (report) => {
    dispatch(selectReport(report));
    document.getElementById("updateModal").showModal();
  };

  const handleDelete = (report) => {
    document.getElementById("deleteModal").showModal();
    dispatch(selectReport(report));
  };

  const confirmDelete = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await dispatch(deleteReportThunk(selectedReport.id));

      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Laporan berhasil Dihapus");
        closeModal("deleteModal");
      } else {
        throw new Error(response.payload || "Gagal memproses laporan");
      }
    } catch (err) {
      setError(err.message || "Failed to submit report");
      console.error("Error submitting report:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (id) => {
    document.getElementById(id).close();
    dispatch(selectReport(null));
  };

  return (
    <>
      <div className="user-reports-container w-full bg-base-100 min-h-screen max-w-screen-xl mx-auto">
        <div className="user-reports-wrapper p-8 space-y-8">
          <button onClick={() => navigator("/dashboard")}>
            <ArrowLeft className="h-12 w-12 text-gray-300 " />
          </button>
          <h1 className="text-3xl font-bold">Laporan Banjir Saya</h1>

          <div className="user-reports w-full grid grid-cols-1 gap-8">
            {userReports.map((item, key) => {
              console.log(item);
              return (
                <ReportCardFull
                  imageUrl={item.imageUrl}
                  desc={item.description}
                  location={mainAreas[key]}
                  waterLevel={item.waterLevel}
                  status={item.status}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                  key={key}
                />
              );
            })}
          </div>
        </div>

        <dialog id="updateModal" className="modal">
          <ReportForm
            closeModal={() => closeModal(id)}
            mode={"update"}
            initialData={selectedReport}
          />
        </dialog>

        <dialog id="deleteModal" className="modal">
          <div className="modal-box space-y-12">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this?
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <button
                className="btn btn-gray-500 text-black"
                onClick={() => closeModal("deleteModal")}
              >
                No, cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, I'm Sure
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </>
  );
}
