export const VAULT_TYPE_USDC = 1;
export const VAULT_TYPE_USDT = 2;

export const ACTION_EXECUTOR_ADDRESSES = {
    ethereum: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    arbitrum: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    bsc: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    era: "0xdF3E4dA3EE75F1018d277222967ce3D69F3271D9",
    base: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    scroll: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    linea: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    polygon: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    polygon_zkevm: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    optimism: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    opbnb: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    avax: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    eon: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
    fantom: "0x7b2E3FC7510D1A51b3bef735F985446589219354",
} as const;

export const VAULT_ASSET_ADDRESSES = {
    [VAULT_TYPE_USDC]: {
        ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        arbitrum: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        bsc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        era: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
        base: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
        scroll: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
        linea: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
        polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        polygon_zkevm: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
        optimism: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        opbnb: undefined,
        avax: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        eon: '0xCc44eB064CD32AAfEEb2ebb2a47bE0B882383b53',
        fantom: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    },
    [VAULT_TYPE_USDT]: {
        ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        arbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        bsc: '0x55d398326f99059fF775485246999027B3197955',
        era: undefined,
        base: undefined,
        scroll: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
        linea: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
        polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        polygon_zkevm: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
        optimism: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        opbnb: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
        avax: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
        eon: '0xA167bcAb6791304EDa9B636C8beEC75b3D2829E6',
        fantom: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
    },
};
