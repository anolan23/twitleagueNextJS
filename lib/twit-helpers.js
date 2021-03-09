class TwitHelpers {
    static monthIndexToName = (index) => {
        let months = []
        months[0] = "jan";
        months[1] = "feb";
        months[2] = "mar";
        months[3] = "april";
        months[4] = "may";
        months[5] = "june";
        months[6] = "july";
        months[7] = "aug";
        months[8] = "sep";
        months[9] = "oct";
        months[10] = "nov";
        months[11] = "dec";

        return months[index];
    }
}

export default TwitHelpers;