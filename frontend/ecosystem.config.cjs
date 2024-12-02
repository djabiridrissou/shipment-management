module.exports = {
  apps: [
    {
      name: "shipment",
      script: "build/server.cjs",
      cwd: "./",
      exec_mode: "cluster",
      instances: "1",
      env: {
        VITE_NODE_ENV: "production",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};