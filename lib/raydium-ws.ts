interface RaydiumRPCResponse {
  success: boolean;
  data: {
    rpcs: string[];
  };
}

interface PriceSubscription {
  method: string;
  params: {
    mints: string[];
  };
}

type PriceCallback = (prices: { [key: string]: string }) => void;

export class RaydiumWebSocket {
  private ws: WebSocket | null = null;
  private readonly callbacks: Map<string, PriceCallback> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private async connect(): Promise<void> {
    try {
      const wsUrl = "https://raydium-raydium-5ad5.mainnet.rpcpool.com/";
      console.log("Connecting to raydium websocket")
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to Raydium WebSocket');
        this.reconnectAttempts = 0;
        
        // Resubscribe to all active subscriptions
        this.callbacks.forEach((_, mint) => {
          this.subscribeToPrices([mint]);
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.data && typeof data.data === 'object') {
            // Notify all callbacks with the new price data
            this.callbacks.forEach((callback, mint) => {
              if (data.data[mint]) {
                callback({ [mint]: data.data[mint] });
              }
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Raydium WebSocket connection closed');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Raydium WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to Raydium WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private subscribeToPrices(mints: string[]): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscription: PriceSubscription = {
        method: 'subscribe',
        params: { mints }
      };
      this.ws.send(JSON.stringify(subscription));
    }
  }

  public async subscribeToPrice(mint: string, callback: PriceCallback): Promise<void> {
    this.callbacks.set(mint, callback);
    
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }
    
    this.subscribeToPrices([mint]);
  }

  public unsubscribeFromPrice(mint: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const unsubscription = {
        method: 'unsubscribe',
        params: { mints: [mint] }
      };
      this.ws.send(JSON.stringify(unsubscription));
    }
    this.callbacks.delete(mint);
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }
}

// Export a singleton instance
export const raydiumWS = new RaydiumWebSocket();
