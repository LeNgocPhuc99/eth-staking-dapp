const path = require("path");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },

  mocha: {},
  contracts_directory: path.join(__dirname, "contracts"),
  contracts_build_directory: path.join(__dirname, "src/abis"),
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10",
      optimizer: {
        enabled: false,
        runs: 200,
      },
      evmVersion: "byzantium",
    },
  },
};
