function buildViewModel(title) {
  return {
    enableLiveReload: process.env.NODE_ENV !== "production",
    title,
  };
}

export function buildHome(req, res) {
  res.render("home", buildViewModel("Welcome Home"));
}

export function buildAbout(req, res) {
  res.render("about", buildViewModel("About Me"));
}
