import { Gauge, MapPin, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { createReport, updateReportThunk } from "../redux/slices/reportSlice";

const ReportForm = ({ mode = "create", initialData = null, closeModal }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    location: "",
    coordinates: { lat: -6.2, lng: 106.816666 },
    waterLevel: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("map").setView(
      [formData.coordinates.lat, formData.coordinates.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const markerInstance = L.marker(
      [formData.coordinates.lat, formData.coordinates.lng],
      {
        draggable: true,
      }
    ).addTo(mapInstance);

    markerInstance.on("dragend", (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      updateCoordinates(position);
      reverseGeocode(position);
    });

    mapInstance.on("click", (event) => {
      const { lat, lng } = event.latlng;
      const newCoordinates = { lat, lng };

      markerInstance.setLatLng(newCoordinates);

      updateCoordinates(newCoordinates);

      reverseGeocode(newCoordinates);
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData({
        location: initialData.location || "",
        coordinates: initialData.coordinates || { lat: -6.2, lng: 106.816666 },
        waterLevel: initialData.waterLevel || "",
        description: initialData.description || "",
        status: initialData.status,
      });

      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [mode, initialData]);

  const updateCoordinates = (position) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        lat: position.lat,
        lng: position.lng,
      },
    }));
  };

  const reverseGeocode = async (position) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = await response.json();

      const address = data.address;
      const mainArea = [
        address.suburb || address.district || address.city_district,
        address.city || address.municipality,
        address.state,
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        location: mainArea,
      }));
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "waterLevel" ? parseFloat(value) || "" : value,
    }));
  };

  const handleLocationInputKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.location
          )}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          const newCoordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

          setFormData((prev) => ({
            ...prev,
            coordinates: newCoordinates,
          }));

          if (marker) {
            marker.setLatLng(newCoordinates);
          }

          map.setView(newCoordinates, 13);
        } else {
          toast.error("Lokasi tidak ditemukan");
        }
      } catch (error) {
        console.error("Error searching location:", error);
        toast.error("Gagal mencari lokasi");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reportData = new FormData();

      reportData.append("location", formData.location);
      reportData.append("waterLevel", formData.waterLevel.toString());
      reportData.append("description", formData.description);
      reportData.append("coordinates", JSON.stringify(formData.coordinates));

      // Add status to FormData only in update mode
      if (mode === "update") {
        reportData.append("status", formData.status);
      }

      if (image) {
        reportData.append("image", image);
      }

      let resultAction;
      if (mode === "create") {
        resultAction = await dispatch(createReport(reportData));
      } else {
        resultAction = await dispatch(
          updateReportThunk({
            id: initialData.id,
            data: reportData,
          })
        );
      }

      if (resultAction.meta.requestStatus === "fulfilled") {
        toast.success(
          `Laporan berhasil ${mode === "create" ? "dibuat" : "diperbarui"}`
        );
        closeModal("reportModal");
      } else {
        throw new Error(resultAction.payload || "Gagal memproses laporan");
      }
    } catch (err) {
      setError(err.message || "Failed to submit report");
      console.error("Error submitting report:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="modal-box bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Buat Laporan Banjir
            </h1>

            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan alamat lokasi"
                    value={formData.location}
                    onChange={handleInputChange}
                    onKeyUp={handleLocationInputKeyPress}
                    required
                  />
                  <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Map */}
              <div className="h-64 rounded-lg border">
                <div id="map" className="h-full w-full rounded-lg"></div>
              </div>

              {/* Coordinates Display */}
              <div className="text-sm text-gray-500">
                Koordinat: {formData.coordinates.lat.toFixed(6)},{" "}
                {formData.coordinates.lng.toFixed(6)}
              </div>

              {/* Water Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tinggi Air (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="waterLevel"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan tinggi air dalam cm"
                    value={formData.waterLevel}
                    onChange={handleInputChange}
                    required
                  />
                  <Gauge className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Jelaskan kondisi banjir di lokasi"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Foto
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-auto object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Drag & drop foto atau klik untuk memilih
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {mode === "update" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Laporan
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={formData.status === "ACTIVE"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Aktif</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="RESOLVED"
                        checked={formData.status === "RESOLVED"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Selesai</span>
                    </label>
                  </div>
                </div>
              )}
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" id="closeModal">
        <button>close</button>
      </form>
    </>
  );
};

export default ReportForm;
