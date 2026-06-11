import React from "react";
import Footer from "./Footer";
import { useLocation, useParams, useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="rounded-[18px] h-[210px] bg-zinc-200 animate-pulse" />
);

/* ═══════════════════════════════════════════
   COMING SOON
═══════════════════════════════════════════ */
const ComingSoon = ({ message = "This content is coming soon." }) => (
  <div className="w-full py-16 flex justify-center">
    <div className="flex flex-col items-center gap-4 bg-white border border-zinc-200 rounded-2xl px-14 py-12 max-w-sm text-center shadow-sm">
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="17" stroke="rgba(220,38,38,0.4)" strokeWidth="2" />
        <path d="M19 11v8.5l4.5 2.7" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="text-lg font-black tracking-tight text-zinc-900 mt-1">
        Coming Soon
      </h2>
      <p className="text-zinc-500 text-sm leading-relaxed">{message}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   EXTERNAL LINK ICON
═══════════════════════════════════════════ */
const ExtIcon = () => (
  <svg
    width="10" height="10" viewBox="0 0 10 10" fill="none"
    className="opacity-40 shrink-0"
  >
    <path
      d="M1.5 8.5L8.5 1.5M8.5 1.5H4.5M8.5 1.5V5.5"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
    />
  </svg>
);

/* ═══════════════════════════════════════════
   ASSET CARD
═══════════════════════════════════════════ */
const AssetCard = ({ asset }) => {
  const src = asset.icon?.startsWith(".")
    ? asset.icon.replace("./", "/")
    : asset.icon;

  return (
    <a
      href={asset.url}
      target="_blank"
      rel="noreferrer"
      className="group no-underline block"
    >
      <div className="
        bg-white rounded-[18px] overflow-hidden
        border-[1.5px] border-zinc-200/80
        shadow-[0_4px_16px_rgba(0,0,0,0.09)]
        transition-all duration-250 ease-out
        hover:-translate-y-[5px]
        hover:border-red-600
        hover:shadow-[0_12px_32px_rgba(220,38,38,0.13)]
        cursor-pointer
      ">
        {/* Image area */}
        <div className="h-[130px] flex items-center justify-center p-4 bg-[#ffffff] border-b border-zinc-100">
          {src ? (
            <img
              src={src}
              alt={asset.title}
              className="max-w-[100px] max-h-[100px] object-contain transition-transform duration-250 group-hover:scale-105"
            />
          ) : (
            <svg
              width="48" height="48" viewBox="0 0 48 48" fill="none"
              className="opacity-15"
            >
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.5" />
              <path d="M14 24h20M14 17h20M14 31h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Label */}
        <div className="px-[14px] py-[13px] text-center">
          <p className="text-[12.5px] font-black text-zinc-800 uppercase tracking-[0.07em] leading-snug line-clamp-2">
            {asset.title}
          </p>
          {/* {asset.url && (
            <span className="inline-flex items-center gap-[3px] mt-[5px] text-[11px] text-zinc-400 font-medium">
              <ExtIcon />
              Open link
            </span>
          )} */}
        </div>
      </div>
    </a>
  );
};

/* ═══════════════════════════════════════════
   BACK BUTTON
═══════════════════════════════════════════ */
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      inline-flex items-center gap-[6px]
      px-[14px] py-[7px]
      bg-zinc-900 hover:bg-zinc-800 active:scale-[0.97]
      text-white text-[11px] font-bold uppercase tracking-[0.06em]
      rounded-[10px] border border-zinc-700
      transition-all duration-150 cursor-pointer shrink-0
    "
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Back
  </button>
);

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
const DynamicProductView = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { brandName, tileName } = useParams();

  const [fetchedProduct, setFetchedProduct] = React.useState(null);
  const [loading,        setLoading]        = React.useState(true);
  const [error,          setError]          = React.useState(null);

  const product   = location.state?.product || fetchedProduct;
  const hasAssets = product?.assets?.length > 0;

  React.useEffect(() => {
    if (!location.state?.product && brandName && tileName) {
      setLoading(true);
      fetch(
        `/api/v1/wrappers/tile-by-name/${encodeURIComponent(brandName)}/${encodeURIComponent(tileName)}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        })
        .then((data) => { setFetchedProduct(data); setLoading(false); })
        .catch((err) => { setError(err.message); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [location.state?.product, brandName, tileName]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#070707] pt-28 pb-12">
        <div className="max-w-5xl mx-auto px-6 w-full flex-grow">
          <div className="bg-[#f5f1f1] border border-zinc-200/60 rounded-[24px] px-10 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {/* Fake header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200/80">
              <div className="w-20 h-8 rounded-[10px] bg-zinc-300 animate-pulse" />
              <div className="w-40 h-7 rounded-lg bg-zinc-300 animate-pulse" />
              <div className="w-14 h-5 rounded-lg bg-zinc-300 animate-pulse" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-5">
              {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── ERROR / EMPTY ── */
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-[#070707] pt-28 pb-12">
        <div className="max-w-5xl mx-auto px-6 w-full flex-grow">
          <div className="bg-[#f5f1f1] border border-zinc-200/60 rounded-[24px] px-10 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <ComingSoon message={error || "The product you're looking for is unavailable."} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── MAIN VIEW ── */
  return (
    <div className="flex flex-col min-h-screen bg-[#070707] pt-28">
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow mb-14">

        <div className="bg-[#f5f1f1] border border-zinc-200/60 rounded-[24px] px-10 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200/80">
            <BackButton onClick={() => navigate(-1)} />

            <h1 className="text-[clamp(20px,3.5vw,32px)] font-black uppercase tracking-[0.14em] text-black/[0.50] select-none px-4 text-center flex-1">
              {product.name}
            </h1>

            {/* <span className="text-[12px] font-semibold text-zinc-400 tracking-wide shrink-0">
              {product.assets?.length ?? 0} asset{product.assets?.length !== 1 ? "s" : ""}
            </span> */}
          </div>

          {/* ── Content ── */}
          {!hasAssets ? (
            <ComingSoon message="No assets available yet for this product." />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-4">
              {product.assets.map((asset, i) => (
                <AssetCard key={asset._id ?? i} asset={asset} />
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DynamicProductView;