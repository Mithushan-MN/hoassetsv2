import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Drive = () => {
  const cards = [
    {
      href: "https://web.facebook.com/HuntsmanThermography?_rdc=1&_rdr",
      img: "./images/socialM.png",
      alt: "Social Media Map",
      title: "Thermal Footage Influencers Map",
    },
    {
      href: "https://www.linkedin.com/company/huntsman-optics-ltd/",
      img: "./images/onsite.png",
      alt: "LinkedIn",
      title: "HO Internal Map",
    },
    {
      href: "https://login.bigcommerce.com/login",
      img: "./images/off.png",
      alt: "BigCommerce",
      title: "HO Internal Drive For Customers Map",
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {cards.map((card, i) => (
            <Link
              key={i}
              to={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center no-underline hover:border-red-600/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300"
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-20 h-20 mx-auto object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
              />
              <h4 className="text-white text-sm font-bold uppercase tracking-wide">
                {card.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Drive;
