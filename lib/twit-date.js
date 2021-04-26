class TwitDate {

    static getDay = (timestamp) => {
        const date = new Date(timestamp);
        const index = date.getDay();
        const days = [];
        days[0] = 'Sun';
        days[1] = 'Mon';
        days[2] = 'Tue';
        days[3] = 'Wed';
        days[4] = 'Thu';
        days[5] = 'Fri';
        days[6] = 'Sat';
        return days[index];   
    }

    static getDate = (timestamp) => {
        const date = new Date(timestamp);
        const dayOfMonth = "0" + date.getDate();
        return dayOfMonth.slice(-2);   
    }

    static getMonth = (timestamp) => {
        const date = new Date(timestamp);
        const index = date.getMonth();
        const months = [];
        months[0] = 'Jan';
        months[1] = 'Feb';
        months[2] = 'Mar';
        months[3] = 'Apr';
        months[4] = 'May';
        months[5] = 'June';
        months[6] = 'July';
        months[7] = 'Aug';
        months[8] = 'Sep';
        months[9] = 'Oct';
        months[10] = 'Nov';
        months[11] = 'Dec';
        return months[index];    
    }
    static formatAMPM = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let time = hours + ':' + minutes + ampm;
        return time;
      }

}

export default TwitDate;