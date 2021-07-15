import "@fortawesome/fontawesome-free/css/all.css";
import "../sass/_main.scss";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";

import { TwitProvider } from "../context/TwitProvider";
import TwitPanel from "../components/TwitPanel";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <TwitProvider>
      <Component {...pageProps} />
    </TwitProvider>
  );
}

export default MyApp;
