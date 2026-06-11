import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTiktok, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column - Logo */}
        <div className="flex flex-col justify-center">
          <img src="/images/logo_02.png" className="h-20 w-auto object-contain mr-auto" alt="footer-logo" />
        </div>

        {/* Middle Column - About Us */}
        <div className="space-y-4">
          <div className="text-white font-extrabold text-lg tracking-wider uppercase">About us</div>
          <p className="text-lg leading-relaxed text-zinc-400">
            Huntsman Optics sells a range of high quality Thermal & Night Vision optics. We Supply these products through credible retail outlets stores, and suitable online stores.
          </p>
        </div>

        {/* Right Column - Contact & Socials */}
        <div className="space-y-4">
          <div className="text-white font-extrabold text-lg tracking-wider uppercase">Contact us</div>
          <div className="space-y-2 text-lg">
            <div>
              <a href="https://wa.me/61488647667" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faPhoneVolume} className="text-red-500" /> +61 450 662 270
              </a>
            </div>
            <div>
              <a href="mailto:haris@huntsmanoptics.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-500" /> haris@huntsmanoptics.com
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 pt-2">
            <a target="_blank" href="https://www.facebook.com/huntsmanoptics/" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-600/10 transition-all">
              <FontAwesomeIcon icon={faFacebook} size="sm" />
            </a>
            <a target="_blank" href="https://www.instagram.com/huntsmanoptics/" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-600/10 transition-all">
              <FontAwesomeIcon icon={faInstagram} size="sm" />
            </a>
            <a target="_blank" href="https://www.tiktok.com/@huntsman.optics?_t=8m8XFKjbfT0&&_r=1" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-600/10 transition-all">
              <FontAwesomeIcon icon={faTiktok} size="sm" />
            </a>
            <a target="_blank" href="https://www.youtube.com/@huntsmanoptics8102" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-600/10 transition-all">
              <FontAwesomeIcon icon={faYoutube} size="sm" />
            </a>
            <a target="_blank" href="https://www.linkedin.com/company/huntsman-optics-ltd/" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-600/10 transition-all">
              <FontAwesomeIcon icon={faLinkedin} size="sm" />
            </a>
          </div>
        </div>

      </div>

      <hr className="border-zinc-900 my-8 max-w-7xl mx-auto" />

      <div className="text-center text-lg text-zinc-600">
        <p>
          Copyright © {new Date().getFullYear()} <a target="_blank" href="https://www.huntsmanoptics.com/" rel="noreferrer" className="hover:text-white transition-colors">HuntsmanOptics</a>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;