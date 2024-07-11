module.exports = [
  {
    context: ["/identity", "/api"],
    target: "https://platform.fintacharts.com",
    secure: false,
    changeOrigin: true,
  },
  {
    context: ["/api/streaming"],
    target: "wss://platform.fintacharts.com",
    ws: true,
    secure: false,
    changeOrigin: true,
  },
];
