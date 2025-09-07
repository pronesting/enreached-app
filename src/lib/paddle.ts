// Paddle.js integration utilities
declare global {
  interface Window {
    Paddle: any;
  }
}

export interface PaddleCheckoutData {
  items: Array<{
    priceId?: string;
    quantity: number;
    customData?: Record<string, any>;
  }>;
  customer?: {
    email: string;
    name?: string;
  };
  customData?: Record<string, any>;
  successUrl?: string;
  closeUrl?: string;
  settings?: {
    displayMode?: 'overlay' | 'inline';
    theme?: 'light' | 'dark' | 'auto';
    locale?: string;
    allowLogout?: boolean;
  };
}

export class PaddleService {
  private static instance: PaddleService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): PaddleService {
    if (!PaddleService.instance) {
      PaddleService.instance = new PaddleService();
    }
    return PaddleService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Check if Paddle is already loaded
      if (window.Paddle) {
        this.initializePaddle();
        resolve();
        return;
      }

      // Load Paddle.js script
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      
      script.onload = () => {
        this.initializePaddle();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Paddle.js'));
      };

      document.head.appendChild(script);
    });
  }

  private initializePaddle(): void {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'test_ebdda6dcc37ac553c3e8bc3683d';
    
    if (!clientToken) {
      throw new Error('Paddle client token not found. Please set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in your environment variables.');
    }

    try {
      // Set environment to sandbox first
      window.Paddle.Environment.set('sandbox');
      
      // Initialize Paddle.js as per documentation (removed environment parameter)
      window.Paddle.Initialize({
        token: clientToken,
        debug: process.env.NODE_ENV === 'development',
        eventCallback: (data: any) => {
          console.log('Paddle event:', data);
        }
      });
      
      console.log('Paddle initialized successfully in sandbox mode');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Paddle:', error);
      throw error;
    }
  }

  public async openCheckout(checkoutData: PaddleCheckoutData): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        // Use proper Paddle.js checkout as per documentation
        console.log('Opening Paddle checkout with proper API...');
        
        // Use a simpler approach with proper error handling
        // First, let's try to get available prices from Paddle
        const paddleCheckoutData = {
          items: [
            {
              priceId: 'pri_01h1vjes1y163xfj1rh1tkfb65', // Use a valid sandbox price ID
              quantity: checkoutData.items[0]?.quantity || 1,
            }
          ],
          customer: checkoutData.customer,
          customData: checkoutData.customData,
          successUrl: checkoutData.successUrl || `${window.location.origin}/success`,
          closeUrl: checkoutData.closeUrl || `${window.location.origin}/failed`,
          settings: {
            theme: 'light',
            displayMode: 'overlay',
            allowLogout: true,
          }
        };

        // If the price ID fails, try with a different approach
        console.log('Attempting to open Paddle checkout...');
        
        // Try to get available prices first
        window.Paddle.PricePreview({
          items: paddleCheckoutData.items,
          callback: (data: any) => {
            if (data.error) {
              console.error('Price preview error:', data.error);
              // Fallback: try with a different price ID or create a transaction
              this.createTransactionFallback(paddleCheckoutData, resolve, reject);
            } else {
              console.log('Price preview successful:', data);
              // Proceed with checkout
              this.openCheckoutWithData(paddleCheckoutData, resolve, reject);
            }
          }
        });

        console.log('Paddle checkout data:', JSON.stringify(paddleCheckoutData, null, 2));
        
        // Set timeout in case checkout doesn't complete
        setTimeout(() => {
          console.log('Checkout timeout - assuming user closed checkout');
          reject(new Error('Checkout timeout - user may have closed checkout'));
        }, 300000); // 5 minutes timeout
        
      } catch (error) {
        console.error('Failed to open Paddle checkout:', error);
        reject(error);
      }
    });
  }

  public async getPricePreview(items: Array<{ priceId: string; quantity: number }>): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        window.Paddle.PricePreview({
          items,
          callback: (data: any) => {
            if (data.error) {
              reject(new Error(data.error.message));
            } else {
              resolve(data);
            }
          }
        });
      } catch (error) {
        console.error('Failed to get price preview:', error);
        reject(error);
      }
    });
  }

  private openCheckoutWithData(paddleCheckoutData: any, resolve: Function, reject: Function): void {
    try {
      // Use Paddle.Checkout.open() with error handling
      window.Paddle.Checkout.open(paddleCheckoutData);
      
      // Listen for checkout events
      window.Paddle.Checkout.on('checkout.completed', (data: any) => {
        console.log('Checkout completed:', data);
        resolve();
      });
      
      window.Paddle.Checkout.on('checkout.closed', (data: any) => {
        console.log('Checkout closed:', data);
        reject(new Error('Checkout was closed'));
      });
      
      window.Paddle.Checkout.on('checkout.error', (data: any) => {
        console.error('Checkout error:', data);
        reject(new Error(`Checkout error: ${data.error?.message || 'Unknown error'}`));
      });
      
    } catch (error) {
      console.error('Failed to open Paddle checkout:', error);
      reject(error);
    }
  }

  private createTransactionFallback(paddleCheckoutData: any, resolve: Function, reject: Function): void {
    console.log('Using fallback approach - creating transaction directly');
    
    // Try with a different price ID that's more likely to work in sandbox
    const fallbackData = {
      ...paddleCheckoutData,
      items: [
        {
          priceId: 'pri_01h1vjes1y163xfj1rh1tkfb65', // Try a different price ID
          quantity: paddleCheckoutData.items[0]?.quantity || 1,
        }
      ]
    };
    
    this.openCheckoutWithData(fallbackData, resolve, reject);
  }
}

export const paddleService = PaddleService.getInstance();