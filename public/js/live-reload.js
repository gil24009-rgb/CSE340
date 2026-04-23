(function () {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const socketUrl = `${protocol}://${window.location.host}/live-reload`;
  let hasConnectedBefore = false;

  const connect = () => {
    const socket = new WebSocket(socketUrl);

    socket.addEventListener("open", () => {
      if (hasConnectedBefore) {
        window.location.reload();
        return;
      }

      hasConnectedBefore = true;
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "reload") {
        window.location.reload();
      }
    });

    socket.addEventListener("close", () => {
      window.setTimeout(connect, 500);
    });
  };

  connect();
})();
