export const monthIndexToName = (index) => {
  let months = [];
  months[0] = "jan";
  months[1] = "feb";
  months[2] = "mar";
  months[3] = "apr";
  months[4] = "may";
  months[5] = "june";
  months[6] = "july";
  months[7] = "aug";
  months[8] = "sep";
  months[9] = "oct";
  months[10] = "nov";
  months[11] = "dec";

  return months[index];
};

export const dateString = (string) => {
  const date = new Date(string);
  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString([], dateOptions);
  const timeOptions = { hour12: true, hour: "2-digit", minute: "2-digit" };
  const time = date.toLocaleTimeString([], timeOptions);
  const result = `${formattedDate}, ${time}`;
  return result;
};

export const truncate = (string, length) => {
  const newString =
    string.length > length ? string.substring(0, length - 3) + "..." : string;
  return newString;
};

export const numberSuffix = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
};
