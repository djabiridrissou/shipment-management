// construction
//this is the ecosystem file for pm2 for jodi-construction
module.exports = {
  apps: [
    {
      name: "jodi-construction-be",
      script: "build/index.js",
      exec_mode: "cluster",
      instances: "2",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "159.223.135.127",
      ref: "origin/prod",
      repo: "git@github.com:Calculus-Solutions/jodi_be.git",
      path: "/home/jodi_construction/jodi_be",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
