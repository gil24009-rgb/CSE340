export function buildHome(req, res) {
  res.render("index", {
    enableLiveReload: process.env.NODE_ENV !== "production",
    title: "Home",
  });
}
