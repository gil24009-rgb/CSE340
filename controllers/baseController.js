import { getAllCourses } from "../models/catalogModel.js";
import { getSortedFaculty } from "../src/models/faculty/faculty.js";

function buildViewModel(title) {
  const courses = getAllCourses();
  const sectionCount = courses.reduce((total, course) => total + course.sections.length, 0);

  return {
    courseCount: courses.length,
    enableLiveReload: process.env.NODE_ENV !== "production",
    facultyCount: getSortedFaculty().length,
    sectionCount,
    title,
  };
}

export function buildHome(req, res) {
  res.render("home", buildViewModel("CSE 340 Course Hub"));
}

export function buildAbout(req, res) {
  res.render("about", buildViewModel("How This Hub Works"));
}
