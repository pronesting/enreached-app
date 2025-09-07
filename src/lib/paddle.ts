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
    const clientToken = 'test_ebdda6dcc37ac553c3e8bc3683d';
    
    if (!clientToken) {
      throw new Error('Paddle client token not found. Please set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in your environment variables.');
    }

    try {
      // Set environment to sandbox first
      window.Paddle.Environment.set('sandbox');
      
      // Simple initialization - no complex event callbacks
      window.Paddle.Initialize({
        token: clientToken,
        debug: true
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
        console.log('Opening Paddle checkout with correct API...');
        
        // Ensure we're in sandbox mode
        window.Paddle.Environment.set('sandbox');
        
        const currentDomain = window.location.origin;
        console.log('Using domain for checkout:', currentDomain);
        
        // Use the correct Paddle.js v2 API format
        const checkoutConfig = {
          items: [
            {
              priceId: 'pro_01k4gbm9hqgtbz0462wxnjpdbk',
              quantity: checkoutData.items[0]?.quantity || 1,
            }
          ],
          customer: checkoutData.customer,
          customData: checkoutData.customData,
          successUrl: checkoutData.successUrl || `${currentDomain}/success`,
          closeUrl: checkoutData.closeUrl || `${currentDomain}/failed`,
          settings: {
            theme: 'light',
            displayMode: 'overlay',
            allowLogout: true,
          }
        };

        console.log('Paddle checkout config:', JSON.stringify(checkoutConfig, null, 2));

        // Use the correct Paddle.js v2 API
        window.Paddle.Checkout.open(checkoutConfig);
        
        // Simple timeout - no complex event handling
        setTimeout(() => {
          console.log('Checkout opened - user can complete payment');
          resolve(); // Resolve immediately after opening
        }, 1000);
        
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
}

export const paddleService = PaddleService.getInstance();