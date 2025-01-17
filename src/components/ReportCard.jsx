import { Droplets, MapPin } from "lucide-react";

const ReportCard = ({ imageUrl, desc, location, waterLevel, user }) => {
  return (
    <>
      <div className="report-card">
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure className="px-8 pt-8">
            <img src={imageUrl} alt="/" className="rounded-xl h-56 w-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{desc}</h2>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <p>{location}</p>
            </span>

            <span className="flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-600" />
              <p>Tinggi Air: {waterLevel}cm</p>
            </span>

            <div className="card-actions justify-end">
              <div className="badge badge-outline">Diupload oleh {user}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportCard;
