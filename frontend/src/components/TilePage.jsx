import { useParams, useNavigate } from "react-router-dom";

const TilePage = ({ wrappers }) => {
  const { brandId, collectionId, tileId } = useParams();
  const navigate = useNavigate();

  const brand = wrappers.find(w => w._id === brandId);
  const collection = brand?.tiles.find(c => c._id === collectionId);
  const tile = collection?.tiles.find(t => t._id === tileId);

  if (!tile) return <div className="text-center text-zinc-400 py-20">Tile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg border border-zinc-700 transition-all mb-6"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">{tile.name}</h2>

      <div className="flex flex-wrap gap-4">
        {tile.assets?.map(asset => (
          <a
            key={asset._id}
            href={asset.url}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:border-red-600 transition-all"
          >
            {asset.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TilePage;