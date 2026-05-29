function buildViewModel(title) {
  return {
    enableLiveReload: process.env.NODE_ENV !== "production",
    title,
  };
}

export function buildHome(req, res) {
  res.render("home", buildViewModel("CSE 340 Workspace"));
}

export function buildAbout(req, res) {
  res.render("about", buildViewModel("Project Notes"));
}
