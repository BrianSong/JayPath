// const sqlite3 = require("sqlite3").verbose();
module.exports = {
    check: function check(courseStatus, courseList) {
        // check areas: 3 of Applications, Systems, Software, Reasoning, Theory
        // check credits
        let areas = [0, 0, 0, 0, 0];
        let credits = 0;
        for (var i = 0; i < courseStatus.length; i++) {
            if (courseStatus[i] == 1) {
                // have taken this course
                if (courseList[i].Area == "Applications") {
                    areas[0]++;
                } else if (courseList[i].Area == "Systems") {
                    areas[1]++;
                } else if (courseList[i].Area == "Software") {
                    areas[2]++;
                } else if (courseList[i].Area == "Reasoning") {
                    areas[3]++;
                } else if (courseList[i].Area == "Theory") {
                    areas[4]++;
                }
                credits += courseList[i].Credits;
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
