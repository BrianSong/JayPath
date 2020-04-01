module.exports = {
    testConflict: function testConflict(courses) { // for testing
        // smart looping based on course taken status
        // console.log("Start to run testConflict.");
        // var courses_taken_status = "00000000000000000000000000";
        // var courses_untaken_id = [];
        // for (var i = 0; i < courses_taken_status.length; i++) {
        //     if (courses_taken_status[i] === "0") {
        //         courses_untaken_id.push(i);
        //     }
        // }
        //
        // // check ineligible
        // var courses_eligible_id = [];
        // for (var i = 0; i < courses_untaken_id.length; i++) {
        //     if (checkEligible(courses_untaken_id[i], courses_taken_status)) {
        //         courses_eligible_id.push(courses_untaken_id[i]);
        //     }
        // }
        console.log("testConflict called");
        // console.log(courses.length);
        // looping over all combination of 3 courses
        let schedule = [];
        let count = 0;
        for (var i = 0; i < courses.length; i++) {
            for (var j = i + 1; j < courses.length; j++) {
                for (var k = j + 1; k < courses.length; k++) {
                    const course1 = courses[i];
                    const course2 = courses[j];
                    const course3 = courses[k];

                    // check time conflict
                    if (checkConflict(course1, course2) || checkConflict(course2, course3) || checkConflict(course1, course3)) {
                    } else {
                        // found no time conflict and send all three courses
                        schedule.push(course1);
                        schedule.push(course2);
                        schedule.push(course3);
                        count++;
                        if (count > 2) {
                            return schedule;
                        }
                    }
                }
            }
        }
        return schedule;
    },

};

function convertTimeToMinute(time) {
    var hour = parseInt(time.substring(0, time.length - 2).split(":")[0]);
    var minute = parseInt(time.substring(0, time.length - 2).split(":")[1]);
    var AMPM = time.substring(time.length - 2);
    if (AMPM == "AM" && hour == 12) {
        hour = hour - 12
    }
    if (AMPM == "PM" && hour < 12) {
        hour = hour + 12
    }
    return hour * 60 + minute;
}

function checkTimeOverlap(time1, time2) {
    var start_minute1 = convertTimeToMinute(time1.split(" - ")[0])
    var end_minute1 = convertTimeToMinute(time1.split(" - ")[1])
    var start_minute2 = convertTimeToMinute(time2.split(" - ")[0])
    var end_minute2 = convertTimeToMinute(time2.split(" - ")[1])
    return (start_minute1 < end_minute2) && (start_minute2 < end_minute1);
}

function checkConflict(course1, course2) {
    var course1_day = course1.DaysOfWeek
    var course1_time = course1.StartTimeEndTime
    var course2_day = course2.DaysOfWeek
    var course2_time = course2.StartTimeEndTime

    var course1_day_array = course1_day.split(", ");
    var course1_time_array = course1_time.split(", ");
    var course2_day_array = course2_day.split(", ");
    var course2_time_array = course2_time.split(", ");

    for (var day of ["M", "T", "W", "Th", "F"]) { // looping every day of the week
        if (course1_day_array.includes(day) && course2_day_array.includes(day)) {
            idx1 = course1_day_array.findIndex(element => element == day);
            idx2 = course2_day_array.findIndex(element => element == day);
            if (checkTimeOverlap(course1_time_array[idx1], course2_time_array[idx2])) {
                return true;
            }
        }
    }
    return false;
}