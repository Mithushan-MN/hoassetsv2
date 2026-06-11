import React from "react";
import Footer from "./Footer";

const NEWS = function () {
  const newsItems = [
    { title: "One", desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, quisquam!" },
    { title: "Two", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, ipsa.." },
    { title: "Three", desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, excepturi?" },
    { title: "Four", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, facere!" },
    { title: "Five", desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui, sit!" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <div className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full space-y-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider uppercase bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            NEW UPDATE
          </h1>
          <p className="mt-3 text-zinc-400 text-sm md:text-base">
            Latest announcements, product releases, and news from Huntsman Optics
          </p>
        </div>
        
        {/* News Feed */}
        <div className="space-y-8">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300 shadow-lg group"
            >
              <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                <img
                  src="/images/NEWS.jpg"
                  alt={`News banner ${item.title}`}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-500"
                  onError={e => { e.currentTarget.src = '/images/default.png'; }}
                />
              </div>
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-center space-y-3">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Update
                </span>
                <h5 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                  {item.title}
                </h5>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default NEWS;
