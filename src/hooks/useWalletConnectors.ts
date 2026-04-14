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
      isSolflare?: boolean;
      isConnected: boolean;
      publicKey?: { toString(): string };
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
    };
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        isConnected: boolean;
        publicKey?: { toString(): string };
        connect(): Promise<{ publicKey: { toString(): string } }>;
        disconnect(): Promise<void>;
      };
    };
    ethereum?: {
      isMetaMask?: boolean;
      isBitKeep?: boolean;
      isBitget?: boolean;
      isTrust?: boolean;
      isTrustWallet?: boolean;
      providers?: Array<Window["ethereum"]>;
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      on(event: string, handler: (...args: unknown[]) => void): void;
      removeListener(event: string, handler: (...args: unknown[]) => void): void;
    };
    bitkeep?: {
      ethereum?: Window["ethereum"];
    };
  }
}

/**
 * Get the correct EVM provider. When multiple wallets inject into window.ethereum,
 * some set a `providers` array. We iterate it to find the right one.
 */
function getEvmProvider(walletId: string): Window["ethereum"] | undefined {
  const providers = (window.ethereum as any)?.providers as Array<any> | undefined;

  if (walletId === "metamask") {
    if (providers) {
      const mm = providers.find((p: any) => p.isMetaMask && !p.isBitKeep && !p.isTrust);
      if (mm) return mm;
    }
    return window.ethereum?.isMetaMask ? window.ethereum : window.ethereum;
  }

  if (walletId === "bitget") {
    // Bitget injects as window.bitkeep.ethereum or flags isBitKeep/isBitget
    if (window.bitkeep?.ethereum) return window.bitkeep.ethereum;
    if (providers) {
      const bg = providers.find((p: any) => p.isBitKeep || p.isBitget);
      if (bg) return bg;
    }
    if (window.ethereum?.isBitKeep || (window.ethereum as any)?.isBitget) return window.ethereum;
    return undefined;
  }

  if (walletId === "trustwallet") {
    if (providers) {
      const tw = providers.find((p: any) => p.isTrust || p.isTrustWallet);
      if (tw) return tw;
    }
    if (window.ethereum?.isTrust || (window.ethereum as any)?.isTrustWallet) return window.ethereum;
    // Trust Wallet on mobile IS window.ethereum
    return window.ethereum;
  }

  return window.ethereum;
}

function getSolanaProvider(walletId: string) {
  if (walletId === "solflare") {
    // Solflare injects window.solflare
    return window.solflare;
  }
  if (walletId === "phantom") {
    return window.phantom?.solana;
  }
  return undefined;
}

export function isWalletInstalled(wallet: WalletInfo): boolean {
  if (wallet.type === "solana") {
    const provider = getSolanaProvider(wallet.id);
    return !!provider;
  }
  if (wallet.id === "bitget") {
    return !!(window.bitkeep?.ethereum || window.ethereum?.isBitKeep || (window.ethereum as any)?.isBitget);
  }
  // For generic EVM, any ethereum provider will do
  return !!window.ethereum;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getChainName(chainId: string): string {
  const id = typeof chainId === "string" ? chainId : `0x${Number(chainId).toString(16)}`;
  const map: Record<string, string> = {
    "0x1": "Ethereum",
    "0x38": "BSC",
    "0x89": "Polygon",
    "0xa4b1": "Arbitrum",
    "0xa": "Optimism",
    "0xa86a": "Avalanche",
    "0x61": "BSC Testnet",
    "0x5": "Goerli",
    "0xaa36a7": "Sepolia",
  };
  return map[id.toLowerCase()] || `Chain ${parseInt(id, 16)}`;
}

export function useWalletConnectors() {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  // Listen for account/chain changes on EVM
  useEffect(() => {
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts || accounts.length === 0) {
        // User disconnected from wallet side
        setConnectedWallets((prev) => prev.filter((w) => {
          const info = SUPPORTED_WALLETS.find((s) => s.id === w.id);
          return info?.type !== "evm";
        }));
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const connect = useCallback(async (walletId: string) => {
    const wallet = SUPPORTED_WALLETS.find((w) => w.id === walletId);
    if (!wallet) return;

    if (!isWalletInstalled(wallet)) {
      toast.error(`${wallet.name} not detected`, {
        description: "Please install the browser extension first.",
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
        if (!provider) throw new Error(`${wallet.name} provider not found`);

        const resp = await provider.connect();
        const pubKey = resp?.publicKey ?? provider.publicKey;
        if (!pubKey) throw new Error("No public key returned. Please try again.");
        const address = pubKey.toString();

        setConnectedWallets((prev) => [
          ...prev.filter((w) => w.id !== walletId),
          { id: walletId, address, chain: "Solana" },
        ]);
        toast.success(`${wallet.name} connected!`, {
          description: shortenAddress(address),
        });
      } else {
        // EVM wallet
        const provider = getEvmProvider(walletId);
        if (!provider) throw new Error(`${wallet.name} provider not found`);

        const accounts = (await provider.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts returned. Please unlock your wallet.");
        }

        const address = accounts[0];
        const chainId = (await provider.request({
          method: "eth_chainId",
        })) as string;
        const chainName = getChainName(chainId);

        setConnectedWallets((prev) => [
          ...prev.filter((w) => w.id !== walletId),
          { id: walletId, address, chain: chainName },
        ]);
        toast.success(`${wallet.name} connected!`, {
          description: `${shortenAddress(address)} on ${chainName}`,
        });
      }
    } catch (err: any) {
      const msg = err?.message || "Connection failed";
      // User rejected
      if (
        msg.includes("User rejected") ||
        msg.includes("user rejected") ||
        msg.includes("User denied") ||
        err?.code === 4001
      ) {
        toast.info("Connection cancelled by user");
      } else {
        toast.error(`Failed to connect ${wallet.name}`, {
          description: msg.length > 100 ? msg.slice(0, 100) + "…" : msg,
        });
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
        if (provider?.disconnect) await provider.disconnect();
      }
      // EVM wallets don't support programmatic disconnect — we clear local state
    } catch {
      // ignore disconnect errors
    }

    setConnectedWallets((prev) => prev.filter((w) => w.id !== walletId));
    toast.info(`${wallet.name} disconnected`);
  }, []);

  const getConnectedWallet = useCallback(
    (walletId: string) => connectedWallets.find((w) => w.id === walletId),
    [connectedWallets]
  );

  return {
    connectedWallets,
    connecting,
    connect,
    disconnect,
    getConnectedWallet,
    isWalletInstalled,
  };
}
