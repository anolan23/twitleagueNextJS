export const fetchStandings = async (url) => {
  const standings = await backend.get(url, {
    params,
  });
  return standings.data;
};

