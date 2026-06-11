import React from "react";

const Hero = () => {
    // The SVG data URI gradient must stay as inline style since Tailwind can't handle it
    const fancyStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='2250' height='900' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath fill='%23800020' d='M0 0h2255v899H0z'/%3E%3Ccircle cx='366' cy='207' r='366' fill='%23FF6B6B'/%3E%3Ccircle cx='1777.5' cy='318.5' r='477.5' fill='%23FF6B6B'/%3E%3Ccircle cx='1215' cy='737' r='366' fill='%23660000'/%3E%3C/g%3E%3C/svg%3E%0A")`,
        backgroundSize: '110% auto',
        backgroundPosition: 'center',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
    };

    return (
        <div className="relative w-full h-[140px] min-[360px]:h-[160px] min-[480px]:h-[180px] sm:h-[200px] md:h-[250px]">
            <div className="absolute top-[64%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-black uppercase leading-none px-5 w-full box-border"
                 style={{ fontFamily: "'Work Sans', sans-serif" }}>
                <p className="text-[24px] min-[360px]:text-[28px] min-[480px]:text-[32px] sm:text-[45px] md:text-[50px] lg:text-[60px] mb-[3px] min-[480px]:mb-[5px] sm:mb-[8px] md:mb-[10px] text-black">
                    Hello Dealer
                </p>
                <p className="text-[16px] min-[360px]:text-[18px] min-[480px]:text-[22px] sm:text-[30px] md:text-[40px]">
                    <span style={fancyStyle}>Welcome To The Portal</span>
                </p>
            </div>
            <img src="/images/paper.avif" alt="logo" className="w-full h-full object-cover" />
        </div>
    );
}

export default Hero;