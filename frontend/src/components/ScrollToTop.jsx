import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Most reliable cross-browser method in SPA + HashRouter
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Alternative (also works well):
    // document.documentElement.scrollTo({ top: 0, behavior: "instant" });
    // or even
    // window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}