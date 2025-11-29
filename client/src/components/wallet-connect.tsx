import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, ChevronDown, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { mainnet, base } from 'wagmi/chains';

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  return num.toFixed(4);
}

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const { switchChain, chains } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentChain = chains.find(c => c.id === chainId);

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" data-testid="button-wallet-connected">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-mono text-sm">{formatAddress(address)}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground">Connected with {connector?.name}</p>
            <p className="text-sm font-medium font-mono">{formatAddress(address)}</p>
            {balance && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatBalance(balance.formatted)} {balance.symbol}
              </p>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground mb-1">Network</p>
            <div className="flex gap-1">
              {[mainnet, base].map((chain) => (
                <Button
                  key={chain.id}
                  variant={chainId === chain.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => switchChain({ chainId: chain.id })}
                  data-testid={`button-switch-chain-${chain.id}`}
                >
                  {chain.name}
                </Button>
              ))}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} data-testid="button-copy-address">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Address'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (address && currentChain?.blockExplorers?.default) {
                window.open(`${currentChain.blockExplorers.default.url}/address/${address}`, '_blank');
              }
            }}
            data-testid="button-view-explorer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="text-destructive focus:text-destructive"
            data-testid="button-disconnect-wallet"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isPending} data-testid="button-connect-wallet">
          <Wallet className="w-4 h-4" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Connect a Wallet</p>
          <p className="text-xs text-muted-foreground">Choose your preferred wallet</p>
        </div>
        <DropdownMenuSeparator />
        {connectors.map((connectorOption) => (
          <DropdownMenuItem
            key={connectorOption.uid}
            onClick={() => connect({ connector: connectorOption })}
            disabled={isPending}
            data-testid={`button-connector-${connectorOption.id}`}
          >
            {connectorOption.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
