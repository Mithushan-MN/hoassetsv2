import React from 'react';
import Footer from "./Footer";

const brands = [
  {
    label: 'Hikmicro',
    logo: '/images/HIKMI.webp',
    link: 'https://www.hikmicrotech.com/',
  },
  {
    label: 'Speras Au/Nz',
    logo: '/images/ima.png',
    link: 'https://www.speraslight.com/',
  },
  {
    label: 'Magne-Tech',
    logo: '/images/ima2.png',
    link: 'https://magne-tech.com/',
  },
  {
    label: 'FJDynamics',
    logo: '/images/fjdy.png',
    link: 'https://www.fjdynamics.com/',
  },
  {
    label: 'Huntsman Tripod and Bipod',
    logo: '/images/2.png',
    link: 'https://huntsmanoptics.com/',
  },
];

const WEBSITE = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <h4 className="text-3xl font-extrabold text-center tracking-wider uppercase mb-12 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          WEBSITES
        </h4>

        {/* Brand Grid Container */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {brands.map(({ label, logo, link }, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group transition-all duration-300"
            >
              <div className="w-64 h-48 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:border-red-600 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.25)]">
                <img src={logo} alt={label} className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all" />
              </div>
              <span className="mt-3 text-sm text-zinc-400 group-hover:text-white font-semibold tracking-wide uppercase transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default WEBSITE;
