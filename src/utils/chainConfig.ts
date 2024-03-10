/** @format */

export const chainIdToInfo = {
  "0x1": {
    lzChainId: 101,
    rpcURL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    blockExplorer: "https://etherscan.io",
    chainName: "Ethereum",

    configs: {
      name: "Ethereum Mainnet",
      chain: "ETH",
      network: "mainnet",
      icon: "ethereum",
      rpc: [
        `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
        `wss://mainnet.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
      ],
      faucets: [],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      infoURL: "https://ethereum.org",
      shortName: "eth",
      chainId: "0x1",
      networkId: 1,
      slip44: 60,
      ens: { registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
      explorers: [
        {
          name: "etherscan",
          url: "https://etherscan.io",
          standard: "EIP3091",
        },
      ],
    },
    lzEntryPoint: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
  },
  "0x89": {
    lzChainId: 109,
    rpcURL: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    chainName: "Polygon",
    configs: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
    lzEntryPoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  "0x38": {
    lzChainId: 102,
    rpcURL: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
    chainName: "BSC",
    configs: {
      chainId: "0x38",
      chainName: "Binance Smart Chain",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com/"],
    },
    lzEntryPoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  "0xa86a": {
    lzChainId: 106,
    rpcURL: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://snowtrace.io",
    chainName: "Avalanche",
    configs: {
      chainId: "0xa86a",
      chainName: "Avalanche Mainnet",
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
      blockExplorerUrls: ["https://snowtrace.io"],
    },
    lzEntryPoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  "0xa": {
    lzChainId: 111,
    rpcURL: "https://mainnet.optimism.io",
    blockExplorer: "https://optimistic.etherscan.io",
    chainName: "Optimism",
    configs: {
      chainId: "0xa",
      chainName: "Optimism",
      nativeCurrency: {
        name: "OP",
        symbol: "OP",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.optimism.io"],
      blockExplorerUrls: ["https://optimistic.etherscan.io"],
    },
    lzEntryPoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  "0x2105": {
    lzChainId: 184,
    rpcURL: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
    chainName: "Base",
    configs: {
      chainId: "0xa",
      chainName: "Base",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.base.org"],
      blockExplorerUrls: ["https://basescan.org"],
    },
    lzEntryPoint: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
  },
  "0x504": {
    lzChainId: 126,
    configs: {
      chainId: "0x504",
      chainName: "Moonbeam",
      nativeCurrency: {
        name: "GLMR",
        symbol: "GLMR",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.api.moonbeam.network"],
      blockExplorerUrls: ["https://moonbeam.moonscan.io"],
    },
    lzEntryPoint: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
  },
} as any;
