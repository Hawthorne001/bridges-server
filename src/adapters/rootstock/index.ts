import { BridgeAdapter, ContractEventParams } from "../../helpers/bridgeAdapter.type";
import { getTxDataFromEVMEventLogs } from "../../helpers/processTransactions";

const bridge = "0x0000000000000000000000000000000001000006";
const rbtc = "0x542fDA317318eBF1d3DEAf76E0b632741A7e677d";

const peginEventParams: ContractEventParams = {
  target: bridge,
  topic: "pegin_btc(address,bytes32,int256,int256)",
  abi: ["event pegin_btc(address indexed receiver, bytes32 indexed btcTxHash, int256 amount, int256 protocolVersion)"],
  logKeys: {
    blockNumber: "blockNumber",
    txHash: "transactionHash",
  },
  fixedEventData: {
    to: bridge,
    token: rbtc,
  },
  argKeys: {
    from: "receiver",
    amount: "amount",
  },
  isDeposit: true,
};

const pegOutEventBeforeFingerrootsParams: ContractEventParams = {
  target: bridge,
  topic: "release_request_received(address,string,uint256)",
  topics: ["0x8e04e2f2c246a91202761c435d6a4971bdc7af0617f0c739d900ecd12a6d7266"],
  abi: ["event release_request_received(address indexed sender, bytes btcDestinationAddress, uint256 amount)"],
  logKeys: {
    blockNumber: "blockNumber",
    txHash: "transactionHash",
  },
  fixedEventData: {
    from: bridge,
    token: rbtc,
  },
  argKeys: {
    amount: "amount",
    to: "sender",
  },
  isDeposit: false,
};

const pegOutEventAfterFingerrootsParams: ContractEventParams = {
  target: bridge,
  topic: "release_request_received(address,string,uint256)",
  abi: ["event release_request_received(address indexed sender, string btcDestinationAddress, uint256 amount)"],
  logKeys: {
    blockNumber: "blockNumber",
    txHash: "transactionHash",
  },
  fixedEventData: {
    from: bridge,
    token: rbtc,
  },
  argKeys: {
    amount: "amount",
    to: "sender",
  },
  isDeposit: false,
};

const constructParams = () => {
  const eventParams = [peginEventParams, pegOutEventBeforeFingerrootsParams, pegOutEventAfterFingerrootsParams];
  return async (fromBlock: number, toBlock: number) => {
    const logs = await getTxDataFromEVMEventLogs("rootstock", "rsk", fromBlock, toBlock, eventParams);
    const results = logs.map((log) => ({ ...log, amount: log?.amount?.mul(1e10) }));
    return results;
  };
};

const adapter: BridgeAdapter = {
  rootstock: constructParams(),
};

export default adapter;
