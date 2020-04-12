// const sqlite3 = require("sqlite3").verbose();
module.exports = {
    checkgraduation: function checkgraduation(courseStatus, coursesInfo) {
        // check areas: 3 of Applications, Systems, Software, Reasoning, Theory
        // check credits
        let areas = [];
        for (var area_loop = 0; area_loop < 5; area_loop++) {
          areas[area_loop] = 0; // initialize all area_count to 0 
        }
        let credits = 0;
        for (var course in courseStatus) {
            if (course == 1) {
                // have taken this course
                if (coursesInfo[course][2] == "Applications") {
                    areas[0]++;
                } else if (coursesInfo[course][2] == "Systems") {
                    areas[1]++;
                } else if (coursesInfo[course][2] == "Software") {
                    areas[2]++;
                } else if (coursesInfo[course][2] == "Reasoning") {
                    areas[3]++;
                } else if (coursesInfo[course][2] == "Theory") {
                    areas[4]++;
                }
                credits += coursesInfo[3]; 
            }
        }

        // check graduation
        let area_count = 0;
        for (area in areas) {
            if (area >= 1) {
                area_count++;
            }
        }
        if (area_count >= 3 && credits >= 72) {
            return true;
        }
        return false;

    },
};
