import {
  getAllCourses,
  getCourseById,
  sortSections,
} from "../models/catalogModel.js";

export function buildCatalog(req, res) {
  res.render("catalog", {
    courses: getAllCourses(),
    title: "Course Catalog",
  });
}

export function buildCourseDetail(req, res, next) {
  const { courseId } = req.params;
  const course = getCourseById(courseId);

  if (!course) {
    const err = new Error(`Course ${courseId} not found`);
    err.status = 404;
    return next(err);
  }

  const currentSort = ["time", "professor", "room"].includes(req.query.sort)
    ? req.query.sort
    : "time";

  console.log(`Viewing course: ${courseId}; sort: ${currentSort}`);

  res.render("course-detail", {
    course: {
      ...course,
      sections: sortSections(course.sections, currentSort),
    },
    currentSort,
    title: `${course.id} - ${course.title}`,
  });
}
