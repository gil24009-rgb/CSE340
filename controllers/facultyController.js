import {
  getFacultyById,
  getSortedFaculty,
} from "../models/facultyModel.js";

export function buildFacultyList(req, res) {
  const currentSort = ["name", "department", "title"].includes(req.query.sort)
    ? req.query.sort
    : "name";

  res.render("faculty/list", {
    currentSort,
    facultyMembers: getSortedFaculty(currentSort),
    title: "Faculty Directory",
  });
}

export function buildFacultyDetail(req, res, next) {
  const { facultyId } = req.params;
  const facultyMember = getFacultyById(facultyId);

  if (!facultyMember) {
    const err = new Error(`Faculty member ${facultyId} not found`);
    err.status = 404;
    return next(err);
  }

  res.render("faculty/detail", {
    facultyMember,
    title: facultyMember.name,
  });
}
