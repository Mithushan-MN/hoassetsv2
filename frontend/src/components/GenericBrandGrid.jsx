import React from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   COMING SOON — reusable, used at 3 levels
══════════════════════════════════════════════════════ */
const ComingSoon = ({ message = "This content is coming soon." }) => (
  <div className="w-full text-center py-16 px-6 text-white">
    <div className="inline-flex flex-col items-center gap-3 bg-white border border-zinc-200 rounded-2xl p-12 max-w-md mx-auto shadow-md">
      {/* simple construction icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="rgba(220,38,38,0.5)" strokeWidth="2"/>
        <path d="M20 12v9l5 3" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      <h2 className="text-4xl text-black font-bold tracking-tight mt-2">
        Coming Soon...
      </h2>
      <p className="text-zinc-800 text-sm">
        {message}
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   COLLECTION PANEL — one collection row with its tile cards
   Shows ComingSoon if collection has no tiles.
══════════════════════════════════════════════════════ */
const CollectionPanel = ({ collection, onTileClick }) => {
  const hasTiles = Array.isArray(collection.tiles) && collection.tiles.length > 0;

  return (
    <div className="bg-[0a372d33]/95 border border-zinc-850 rounded-[20px] overflow-hidden mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* collection title bar matching screenshot style */}
      <div className="px-8 py-6 border-b border-zinc-800/80 bg-zinc-900/10 text-center">
        <h2 className="text-4xl font-black text-zinc-100 uppercase tracking-widest font-sans">
          {collection.name}
        </h2>
      </div>

      {/* ✅ COLLECTION LEVEL: Coming Soon when no tiles */}
      {!hasTiles
        ? (
          <div className="px-8 pb-8">
            <ComingSoon message={`${collection.name} tiles are coming soon.`}/>
          </div>
        )
        : (
          <div className="p-8 flex flex-wrap justify-center md:justify-center gap-6">
            {collection.tiles.map(tile => (
              <div
                key={tile._id || tile.name}
                onClick={() => onTileClick(tile)}
                className="w-[185px] cursor-pointer rounded-[16px] bg-white border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-red-600 hover:shadow-[0_4px_20px_rgba(220,38,38,0.25)] group"
              >
                {/* Solid white thumbnail wrap matching exact dimensions */}
                <div className="h-[140px] bg-white flex items-center justify-center p-4">
                  {tile.image
                    ? <img src={tile.image} alt={tile.name} className="w-full h-full object-contain" />
                    : <svg width="50" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="4" y="4" width="32" height="32" rx="5" stroke="#d1d5db" strokeWidth="1.5"/>
                        <circle cx="14" cy="14" r="3" stroke="#d1d5db" strokeWidth="1.5"/>
                        <path d="M4 28l10-9 7 7 5-4 10 9" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                  }
                </div>
                {/* Card labels with top light borders */}
                <div className="px-3 py-3 border-t border-zinc-100 text-center bg-white group-hover:bg-zinc-50 transition-colors">
                  <span className="text-[14px] font-black text-zinc-600 uppercase tracking-wider font-poppins block truncate">
                    {tile.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   GENERIC BRAND GRID — top-level component
   Receives the full wrapper object from TabSections.
 ══════════════════════════════════════════════════════ */
const GenericBrandGrid = ({ wrapper }) => {
  const navigate = useNavigate();

  const collections = wrapper?.tiles || [];   // wrapper.tiles = collections[]
  const hasCollections = collections.length > 0;

  /* ✅ WRAPPER LEVEL: no collections at all */
  if (!hasCollections) {
    return <ComingSoon message={`${wrapper.name} content is coming soon.`}/>;
  }

  /* ── collection list view ── */
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {collections.map(col => (
        <CollectionPanel
          key={col._id || col.name}
          collection={col}
          onTileClick={tile => {
            if (tile.type === "link" && tile.link) {
              window.open(tile.link, "_blank", "noopener,noreferrer");
            } else {
              navigate(`/${encodeURIComponent(wrapper.name)}/${encodeURIComponent(tile.name)}`, { state: { product: tile } });
            }
          }}
        />
      ))}
    </div>
  );
};

export default GenericBrandGrid;