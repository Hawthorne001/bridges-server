import { getLatestBlock as getLatestBlockSdk, lookupBlock as lookupBlockSdk } from "@defillama/sdk/build/util";
// import { getClient } from "../helpers/sui";
import { tronGetLatestBlock } from "../helpers/tron";
import { getConnection } from "../helpers/solana";
import { Chain } from "@defillama/sdk/build/general";
import fetch from "node-fetch";
import { BridgeNetwork } from "../data/types";
import {
  getLatestBlockHeightForZoneFromMoz,
  getLatestBlockForZoneFromMoz,
  ibcGetBlockFromTimestamp,
} from "../adapters/ibc";
const retry = require("async-retry");

const connection = getConnection();

async function getLatestSlot() {
  return await connection.getSlot("finalized");
}

export async function getLatestBlockNumber(chain: string, bridge?: string): Promise<number> {
  if (chain === "sui") {
    // const client = getClient();
    // return Number(await client.getLatestCheckpointSequenceNumber());
  } else if (chain === "solana") {
    return await getLatestSlot();
  } else if (chain === "tron") {
    return (await tronGetLatestBlock()).number;
  } else if (bridge && bridge === "ibc") {
    return await getLatestBlockHeightForZoneFromMoz(chain);
  }
  return (await getLatestBlock(chain, bridge)).number;
}

const lookupBlock = async (timestamp: number, { chain }: { chain: Chain }) => {
  try {
    const block = await retry(() => lookupBlockSdk(timestamp, { chain }), { retries: 3, factor: 1 });

    return block;
  } catch (e) {
    console.error(e);
    const block = await retry(
      () => fetch(`https://coins.llama.fi/block/${chain}/${timestamp}`).then((res) => res.json()),
      {
        retries: 3,
        factor: 1,
      }
    );
    const blockRes = {
      number: block.height,
      timestamp: block.timestamp,
      block: block.height,
    };
    if (!blockRes?.number) {
      console.error(`Could not find block for timestamp ${timestamp} on chain ${chain}`);
      throw new Error(`Could not find block for timestamp ${timestamp} on chain ${chain}`);
    }
    return blockRes;
  }
};

async function getBlockTime(slotNumber: number) {
  const response = await fetch(process.env.SOLANA_RPC as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBlockTime",
      params: [slotNumber],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  return data.result;
}

export async function getLatestBlock(chain: string, bridge?: string): Promise<{ number: number; timestamp: number }> {
  if (chain === "sui") {
    // const client = getClient();
    // const seqNumber = await client.getLatestCheckpointSequenceNumber();
    // const { timestampMs } = await client.getCheckpoint({ id: seqNumber });
    // return { number: Number(seqNumber), timestamp: Number(timestampMs) };
  } else if (chain === "tron") {
    return await tronGetLatestBlock();
  } else if (chain === "solana") {
    const number = await getLatestSlot();
    const timestamp = await getBlockTime(number);
    if (timestamp === null) {
      throw new Error("Failed to get block time");
    }
    return { number, timestamp };
  } else if (bridge && bridge === "ibc") {
    return await getLatestBlockForZoneFromMoz(chain);
  }

  const timestamp = Math.floor(Date.now() / 1000) - 60;
  return await lookupBlock(timestamp, { chain });
}

export async function getBlockByTimestamp(
  timestamp: number,
  chain: Chain,
  bridge?: BridgeNetwork,
  position?: "First" | "Last"
) {
  if (bridge && bridge.bridgeDbName === "ibc") {
    return await ibcGetBlockFromTimestamp(bridge, timestamp, chain, position);
  } else if (chain === "solana") {
    const { timestamp: latestTimestamp, number: latestSlot } = await getLatestBlock(chain);

    if (timestamp <= latestTimestamp) {
      const estimatedSlot = latestSlot - Math.floor(((latestTimestamp - timestamp) * 1000) / 400);
      const slotTs = await connection.getBlockTime(estimatedSlot);

      if (slotTs === null) {
        throw new Error("Failed to get block time");
      }

      if (Math.abs(slotTs - timestamp) > 400) {
        const blocksOffset = Math.floor(((slotTs - timestamp) * 1000) / 400);
        return { block: estimatedSlot - blocksOffset, timestamp };
      }
      return { block: estimatedSlot, timestamp };
    }
  } else {
    return await lookupBlock(timestamp, { chain });
  }
  throw new Error(`Could not find block for timestamp ${timestamp} on chain ${chain}`);
}

export async function getTimestampBySolanaSlot(
  slot: number,
  latestBlock?: { number: number; timestamp: number } | null
) {
  if (!latestBlock) {
    const timestamp = await getBlockTime(slot);
    if (timestamp === null) {
      throw new Error("Failed to get block time");
    }
    return timestamp;
  }

  const { timestamp: latestTimestamp, number: latestSlot } = latestBlock;
  return latestTimestamp - ((latestSlot - slot) * 400) / 1000;
}
