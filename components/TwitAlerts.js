import { useEffect } from "react";
import { useStore } from "../context/Store";
import TwitAlert from "./TwitAlert";

function TwitAlerts() {
  const [state, dispatch] = useStore();
  const { alerts } = state;
  if (!alerts) return null;
  else if (alerts.length === 0) return null;
  else
    return alerts.map((_alert, index) => {
      return <TwitAlert key={index} alert={{ ..._alert, index }} />;
    });
}

export default TwitAlerts;
