import React from "react";
import Footer from "./Footer";

const SUPPORT = function () {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <div className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="space-y-16">
          {/* Section 1: RMA */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase border-b-4 border-red-600 pb-4">
              Return Material Authorization (RMA) Application
            </h2>

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <img
                src="/images/support.jpg"
                alt="Support Illustration"
                className="w-full h-auto object-cover max-h-96 filter brightness-90 hover:scale-105 transition duration-500"
              />
            </div>

            <h6 className="text-lg font-bold text-red-500">
              Welcome to Huntsman Optics’ RMA Application page.
            </h6>
            
            <div className="space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed">
              <p>
                We use skilled Technicians for warranty assessments, repairs, and calibrations in our
                National Service Centre. For warranty assessment, repair, or calibration, completing
                an RMA form is essential.
              </p>
              <p>
                Please use the link below to fill out all sections or the MA Form and click Submit to
                lodge your request. We aim to respond within 48 hours on business days with return
                authorization, including an RMA number for tracking, a form to sign, and return
                shipping address.
              </p>
              <p className="font-semibold text-zinc-200">
                Ensure the signed MA form is included in your return package.
              </p>
            </div>

            <div className="pt-4">
              <a href="https://www.huntsmanoptics.com/fault-warranty-apply/" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-extrabold uppercase rounded-xl tracking-wider shadow-[0_4px_20px_rgba(220,38,38,0.25)]">
                  RMA Application
                </button>
              </a>
            </div>
          </div>

          {/* Section 2: Zeroing / Troubleshooting */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl space-y-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <img
                src="/images/support2.jpeg"
                alt="Support Illustration"
                className="w-full h-auto object-cover max-h-96 filter brightness-90 hover:scale-105 transition duration-500"
              />
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-white">
              Shooting Accuracy Troubleshooting Form
            </h3>
            
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Download this form to provide detailed information about any zeroing issues you are experiencing with your Hikmicro product. This information will help our support team diagnose and resolve your problem quickly and efficiently.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/document/Zeroing-Form.pdf" download className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all text-white font-bold uppercase rounded-xl tracking-wide text-sm text-center">
                Download Form
              </a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScK7zTKInPTRTTejtdsAkoyIDlx7DsqT5gcwTj2vP1pd0tplw/viewform" target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-bold uppercase rounded-xl tracking-wide text-sm">
                  Australia Online Form
                </button>
              </a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScO6P0uD_cyvgF-y3hrA5ec-Ear5fo24IpcWXaGjxgh9wp7lw/viewform?usp=send_form" target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-bold uppercase rounded-xl tracking-wide text-sm">
                  New Zealand Online Form
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SUPPORT;
