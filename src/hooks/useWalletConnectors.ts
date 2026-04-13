import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  chains: string[];
  type: "solana" | "evm";
  downloadUrl: string;
}

export interface ConnectedWallet {
  id: string;
  address: string;
  chain: string;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "solflare",
    name: "Solflare",
    icon: "🔥",
    color: "hsl(25 95% 55%)",
    description: "Solana's leading wallet",
    chains: ["Solana"],
    type: "solana",
    downloadUrl: "https://solflare.com/download",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    color: "hsl(270 70% 60%)",
    description: "Multi-chain crypto wallet",
    chains: ["Solana", "ETH", "Polygon"],
    type: "solana",
    downloadUrl: "https://phantom.app/download",
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    color: "hsl(30 90% 50%)",
    description: "Popular Ethereum wallet",
    chains: ["ETH", "Polygon", "Arbitrum", "BSC"],
    type: "evm",
    downloadUrl: "https://metamask.io/download/",
  },
  {
    id: "bitget",
    name: "Bitget Wallet",
    icon: "⚡",
    color: "hsl(210 80% 55%)",
    description: "Multi-chain DeFi wallet",
    chains: ["ETH", "BSC", "Solana", "Polygon"],
    type: "evm",
    downloadUrl: "https://web3.bitget.com/",
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "🛡️",
    color: "hsl(210 70% 50%)",
    description: "Secure multi-chain wallet",
    chains: ["ETH", "BSC", "Solana", "BTC"],
    type: "evm",
    downloadUrl: "https://trustwallet.com/download",
  },
];

// Type declarations for window providers
declare global {
  interface Window {
    solflare?: {
      isConnected: boolean;
      publicKey?: { toString(): string };
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
    };
    phantom?: {
      solana?: {
        isConnected: boolean;
        publicKey?: { toString(): string };
        connect(): Promise<{ publicKey: { toString(): string } }>;
        disconnect(): Promise<void>;
      };
    };
    ethereum?: {
      isMetaMask?: boolean;
      isBitKeep?: boolean;
      isTrust?: boolean;
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      on(event: string, handler: (...args: unknown[]) => void): void;
      removeListener(event: string, handler: (...args: unknown[]) => void): void;
    };
    bitkeep?: {
      ethereum?: Window["ethereum"];
    };
    trustwallet?: {
      solana?: Window["phantom"];
    };
  }
}

function getEvmProvider(walletId: string): Window["ethereum"] | undefined {
  if (walletId === "metamask") return window.ethereum?.isMetaMask ? window.ethereum : undefined;
  if (walletId === "bitget") return window.bitkeep?.ethereum ?? (window.ethereum?.isBitKeep ? window.ethereum : undefined);
  if (walletId === "trustwallet") return window.ethereum?.isTrust ? window.ethereum : window.ethereum;
  return window.ethereum;
}

function getSolanaProvider(walletId: string) {
  if (walletId === "solflare") return window.solflare;
  if (walletId === "phantom") return window.phantom?.solana;
  return undefined;
}

function isWalletInstalled(wallet: WalletInfo): boolean {
  if (wallet.type === "solana") {
    return !!getSolanaProvider(wallet.id);
  }
  // For EVM, check if any ethereum provider exists
  return !!window.ethereum;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useWalletConnectors() {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  // Check for already-connected wallets on mount
  useEffect(() => {
    const checkExisting = async () => {
      // Check Solana wallets
      for (const wallet of SUPPORTED_WALLETS.filter((w) => w.type === "solana")) {
        const provider = getSolanaProvider(wallet.id);
        if (provider?.isConnected && provider.publicKey) {
          setConnectedWallets((prev) => {
            if (prev.some((w) => w.id === wallet.id)) return prev;
            return [...prev, { id: wallet.id, address: provider.publicKey!.toString(), chain: "Solana" }];
          });
        }
      }
    };
    checkExisting();
  }, []);

  const connect = useCallback(async (walletId: string) => {
    const wallet = SUPPORTED_WALLETS.find((w) => w.id === walletId);
    if (!wallet) return;

    if (!isWalletInstalled(wallet)) {
      toast.error(`${wallet.name} not detected`, {
        description: "Please install the extension first.",
        action: {
          label: "Download",
          onClick: () => window.open(wallet.downloadUrl, "_blank"),
        },
      });
      return;
    }

    setConnecting(walletId);

    try {
      if (wallet.type === "solana") {
        const provider = getSolanaProvider(walletId);
        if (!provider) throw new Error("Provider not found");
        const resp = await provider.connect();
        const address = resp.publicKey.toString();
        setConnectedWallets((prev) => [...prev.filter((w) => w.id !== walletId), { id: walletId, address, chain: "Solana" }]);
        toast.success(`${wallet.name} connected`, { description: shortenAddress(address) });
      } else {
        // EVM
        const provider = getEvmProvider(walletId);
        if (!provider) throw new Error("Provider not found");
        const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
        if (!accounts.length) throw new Error("No accounts returned");
        const address = accounts[0];
        const chainId = (await provider.request({ method: "eth_chainId" })) as string;
        const chainName = getChainName(chainId);
        setConnectedWallets((prev) => [...prev.filter((w) => w.id !== walletId), { id: walletId, address, chain: chainName }]);
        toast.success(`${wallet.name} connected`, { description: `${shortenAddress(address)} on ${chainName}` });
      }
    } catch (err: any) {
      const msg = err?.message || "Connection failed";
      if (msg.includes("User rejected") || msg.includes("user rejected") || err?.code === 4001) {
        toast.info("Connection cancelled");
      } else {
        toast.error(`Failed to connect ${wallet.name}`, { description: msg });
      }
    } finally {
      setConnecting(null);
    }
  }, []);

  const disconnect = useCallback(async (walletId: string) => {
    const wallet = SUPPORTED_WALLETS.find((w) => w.id === walletId);
    if (!wallet) return;

    try {
      if (wallet.type === "solana") {
        const provider = getSolanaProvider(walletId);
        if (provider) await provider.disconnect();
      }
      // EVM wallets don't have a programmatic disconnect — we just clear state
    } catch {
      // ignore
    }

    setConnectedWallets((prev) => prev.filter((w) => w.id !== walletId));
    toast.info(`${wallet.name} disconnected`);
  }, []);

  const getConnectedWallet = useCallback(
    (walletId: string) => connectedWallets.find((w) => w.id === walletId),
    [connectedWallets]
  );

  return { connectedWallets, connecting, connect, disconnect, getConnectedWallet, isWalletInstalled };
}

function getChainName(chainId: string): string {
  const map: Record<string, string> = {
    "0x1": "Ethereum",
    "0x38": "BSC",
    "0x89": "Polygon",
    "0xa4b1": "Arbitrum",
    "0xa": "Optimism",
    "0xa86a": "Avalanche",
  };
  return map[chainId] || `Chain ${parseInt(chainId, 16)}`;
}
