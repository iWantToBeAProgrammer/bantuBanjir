import { Droplet, MapPin, Pencil, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { selectReport } from "../redux/slices/ReportSlice";

const ReportCardFull = ({
  imageUrl,
  desc,
  location,
  waterLevel,
  status,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="card shadow-xl">
        <img
          src={imageUrl}
          alt="Shoes"
          className="sm:h-96 w-full object-cover object-center"
        />
        <div className="card-body">
          <h2 className="card-title w-full justify-between">
            {desc}
            <div className="badge badge-secondary">{status}</div>
          </h2>
          <span className="text-gray-300 items-center flex gap-2">
            <MapPin className="h-4 w-4" />
            <small>{location}</small>
          </span>
          <span className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            <p>Tinggi Air: {waterLevel}cm</p>
          </span>
        </div>

        <div className="card-actions grid grid-cols-2 m-4">
          <button className="btn btn-primary btn-outline" onClick={onEdit}>
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button className="btn btn-error btn-outline" onClick={onDelete}>
            <Trash className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportCardFull;
