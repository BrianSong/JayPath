module.exports = class Course {
  constructor(id, CourseNumber, CourseTitle, Credits, Instructor, DaysOfWeek, StartTimeEndTime, Track, Prerequisite, Conflicts, Semester, Area) {
    this.id = id;
    this.CourseNumber = CourseNumber;
    this.CourseTitle = CourseTitle;
    this.Credits = Credits;
    this.Instructor = Instructor;
    this.DaysOfWeek = DaysOfWeek;
    this.StartTimeEndTime = StartTimeEndTime;
    this.Track = Track;
    this.Prerequisite = Prerequisite;
    this.Conflicts = Conflicts;
    this.Semester = Semester;
    this.Area = Area;
  }
}
