import {
  getFacultyById,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";

const validSorts = ["name", "department", "title"];

const facultyListPage = (req, res) => {
  const currentSort = validSorts.includes(req.query.sort) ? req.query.sort : "name";

  res.render("faculty/list", {
    currentSort,
    facultyMembers: getSortedFaculty(currentSort),
    title: "Faculty Directory",
  });
};

const facultyDetailPage = (req, res, next) => {
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
};

export { facultyDetailPage, facultyListPage };
