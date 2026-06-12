import React, { useState, useEffect } from 'react';
import GenericBrandGrid from './GenericBrandGrid';

/* ─── Coming Soon placeholder ─────────────────────────────────────
   Shown when a wrapper exists but has no collections / tiles yet.
─────────────────────────────────────────────────────────────────── */
const ComingSoon = ({ name }) => (

  <div className="text-center py-16 px-5  items-center gap-3 bg-white border border-zinc-200 rounded-2xl p-12 max-w-md mx-auto shadow-md">

    <h2 className="text-4xl font-bold mb-3">
      Coming Soon...
    </h2>
    <p className="text-zinc-500 text-base">
      {name ? `${name} content` : 'This page'} is under construction.
    </p>
  </div>
);

/* ─── helper: does a wrapper have any usable content? ─────────────
   A wrapper is "ready" when it has at least one collection that
   contains at least one tile.
─────────────────────────────────────────────────────────────────── */
const hasContent = (wrapper) =>
  Array.isArray(wrapper?.tiles) &&
  wrapper.tiles.some(col => Array.isArray(col?.tiles) && col.tiles.length > 0);

/* ─── TabSections ─────────────────────────────────────────────── */
const TabSections = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [wrappers,   setWrappers]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  /* fetch wrappers */
  useEffect(() => {
    const fetchWrappers = async () => {
      try {
        // const res = await fetch('/api/v1/wrappers');
        const API = process.env.REACT_APP_API_URL || "";
      const res = await fetch(`${API}/wrappers`);
        if (!res.ok) throw new Error('Network response was not ok');
        setWrappers(await res.json());
      } catch (err) {
        console.error('Error fetching wrappers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWrappers();
  }, []);

  /* smooth-scroll to brand content section on card click */
  useEffect(() => {
    if (activeCard !== null) {
      const section = document.getElementById('brand-content');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCard]);

  /* ── states ── */
  if (loading) return (
    <div className="text-center mt-36 text-zinc-400">
      <h2 className="text-2xl font-semibold animate-pulse">Loading...</h2>
    </div>
  );

  if (error) return (
    <div className="text-center mt-36 text-red-500">
      <h2 className="text-2xl font-semibold">Error loading brands: {error}</h2>
    </div>
  );

  /* ─── brand card ─────────────────────────────────────────────── */
  const BrandCard = ({ wrapper, index }) => {
    const isActive = activeCard === index;
    const logoSrc = wrapper.logo || '/images/default.png';

    return (
      <div
        className="flex flex-col items-center cursor-pointer group mt-20"
        onClick={() => setActiveCard(index)}
      >
        {/* Brand Card Wrapper matching exactly the white solid backdrop, thick rounded corners, and card size */}
       <div
  className={`w-[260px] h-[190px] rounded-[24px] bg-white border-[3px] flex items-center justify-center p-8 transition-all duration-300 transform group-hover:scale-[1.03]
  ${
    isActive
      ? 'border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.4)]'
      : 'border-transparent shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:border-red-300 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.7),0_0_80px_rgba(220,38,38,0.3),inset_0_0_60px_rgba(220,38,38,0.1)]'
  }`}
>
          <img
            src={logoSrc}
            alt={wrapper.name}
            className="max-w-full max-h-full object-contain filter hover:brightness-105 transition-all"
            onError={e => { e.currentTarget.src = '/images/default.png'; }}
          />
        </div>
        {/* Pill Label Box matching the grey button capsule wrapper in the screenshot */}
        <div className={`mt-4 px-8 py-2 rounded-full transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${isActive ? 'bg-red-700 text-white font-extrabold border border-red-600' : 'bg-zinc-800/80 text-zinc-300 hover:text-white group-hover:bg-zinc-700/90 font-bold border border-zinc-700/50'}`}>
          <p className="text-xs tracking-wider uppercase font-sans">{wrapper.name}</p>
        </div>
      </div>
    );
  };

  const firstRow  = wrappers.slice(0, 3);
  const secondRow = wrappers.slice(3);
  const activeWrapper = activeCard !== null ? wrappers[activeCard] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* ── row 1: Hikmicro, Speras, Magne-Tech ── */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-14 mb-0">
        {firstRow.map((wrapper, index) => (
          <BrandCard key={wrapper._id || index} wrapper={wrapper} index={index} />
        ))}
      </div>

      {/* ── row 2: FJDynamics, Huntsman Tripod ── */}
      {secondRow.length > 0 && (
        <div className="flex flex-wrap justify-center gap-10 md:gap-14 mb-10">
          {secondRow.map((wrapper, i) => (
            <BrandCard key={wrapper._id || i + 3} wrapper={wrapper} index={i + 3} />
          ))}
        </div>
      )}

      {/* ── brand content ── */}
      {activeWrapper && (
        <section
          id="brand-content"
          className="mt-24 pt-10 border-t border-zinc-850 transition-all duration-500"
        >
          {hasContent(activeWrapper)
            ? <GenericBrandGrid wrapper={activeWrapper} />
            : <ComingSoon name={activeWrapper.name} />
          }
        </section>
      )}

    </div>
  );
};

export default TabSections;