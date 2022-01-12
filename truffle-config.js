module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },

  mocha: {},
  contracts_directory: "./contracts",
  contract_build_directory: "./src/abis",
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
