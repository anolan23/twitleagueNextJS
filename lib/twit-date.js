class TwitDate {
  static getDay = (timestamp) => {
    const date = new Date(timestamp);
    const index = date.getDay();
    const days = [];
    days[0] = "Sun";
    days[1] = "Mon";
    days[2] = "Tue";
    days[3] = "Wed";
    days[4] = "Thu";
    days[5] = "Fri";
    days[6] = "Sat";
    return days[index];
  };

  static getDate = (timestamp) => {
    const date = new Date(timestamp);
    const dayOfMonth = "0" + date.getDate();
    return dayOfMonth.slice(-2);
  };

  static getMonth = (timestamp) => {
    const date = new Date(timestamp);
    const index = date.getMonth();
    const months = [];
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";
    return months[index];
  };

  static getYear = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    return year;
  };
  static formatAMPM = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes + ampm;
    return time;
  };

  static differenceInHours = (date1, date2) => {
    let hourDifference = (date2.getTime() - date1.getTime()) / 1000;
    hourDifference /= 60 * 60;
    return Math.abs(Math.round(hourDifference));
  };

  static differenceInMinutes = (date1, date2) => {
    let minuteDifference = (date2.getTime() - date1.getTime()) / 1000;
    minuteDifference /= 60;
    return Math.abs(Math.round(minuteDifference));
  };

  static dynamicPostDate = (created_at) => {
    const now = new Date();
    const dateCreated = new Date(created_at);
    const oneDay = 60 * 60 * 24 * 1000;
    const oneHour = 60 * 60 * 1000;
    const isOlderThanOneDay = now - dateCreated > oneDay;
    const isOlderThanOneHour = now - dateCreated > oneHour;
    if (isOlderThanOneDay) {
      const month = this.getMonth(dateCreated);
      return `${month} ${dateCreated.getDate()}`;
    } else if (isOlderThanOneHour) {
      const hours = this.differenceInHours(dateCreated, now);
      return `${hours}h`;
    } else {
      const minutes = this.differenceInMinutes(dateCreated, now);
      return `${minutes}m`;
    }
  };

  static localeDateString = (created_at) => {
    const date = new Date(created_at);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  static localeDateStringShort = (created_at) => {
    const date = new Date(created_at);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };
}

export default TwitDate;
