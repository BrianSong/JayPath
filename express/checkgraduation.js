// const sqlite3 = require("sqlite3").verbose();
module.exports = {
    check: function check(courseStatus, courses_info) {
        // check areas: 3 of Applications, Systems, Software, Reasoning, Theory
        // check credits
        courses_credit = courses_info[0];
        courses_area = courses_info[5];
        let areas = [0, 0, 0, 0, 0];
        let credits = 0;
        for (var i = 0; i < courseStatus.length; i++) {
            if (courseStatus[i] == 1) {
                // have taken this course
                if (courses_area[i] == "Applications") {
                    areas[0]++;
                } else if (courses_area[i] == "Systems") {
                    areas[1]++;
                } else if (courses_area[i] == "Software") {
                    areas[2]++;
                } else if (courses_area[i] == "Reasoning") {
                    areas[3]++;
                } else if (courses_area[i] == "Theory") {
                    areas[4]++;
                }
                credits += courses_credit[i];
            }
        }

        // check graduation
        let area_count = 0;
        for (var i = 0; i < areas.length; i++) {
            if (areas[i] >= 1) {
                area_count++;
            }
        }
        if (area_count >= 3 && credits >= 72) {
            return true;
        }
        return false;
    },
};
