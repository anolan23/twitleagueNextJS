import "@fortawesome/fontawesome-free/css/all.css";
import "../sass/_main.scss";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";

import { TwitProvider } from "../context/Store";
import TwitAlerts from "../components/TwitAlerts";

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
      <TwitAlerts />
    </TwitProvider>
  );
}

export default MyApp;
