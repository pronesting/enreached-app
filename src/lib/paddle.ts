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
      // Set environment to sandbox first - this is critical for Vercel
      window.Paddle.Environment.set('sandbox');
      
      // Get the current domain for Vercel deployment
      const currentDomain = window.location.origin;
      console.log('Current domain for Paddle:', currentDomain);
      
      // Initialize Paddle.js with Vercel-specific configuration
      window.Paddle.Initialize({
        token: clientToken,
        debug: true, // Enable debug for Vercel sandbox
        eventCallback: (data: any) => {
          console.log('Paddle event:', data);
          // Handle specific events
          if (data.name === 'checkout.loaded') {
            console.log('Paddle checkout loaded successfully on Vercel');
          } else if (data.name === 'checkout.error') {
            console.error('Paddle checkout error:', data);
          } else if (data.name === 'checkout.initialized') {
            console.log('Paddle checkout initialized for Vercel domain:', currentDomain);
          }
        }
      });
      
      console.log('Paddle initialized successfully in sandbox mode for Vercel');
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
        console.log('Opening Paddle checkout with proper API for Vercel...');
        
        // Ensure we're in sandbox mode before opening checkout
        window.Paddle.Environment.set('sandbox');
        
        // Get current domain for Vercel
        const currentDomain = window.location.origin;
        console.log('Using Vercel domain for checkout:', currentDomain);
        
        const paddleCheckoutData = {
          items: [
            {
              priceId: 'pro_01k4gbm9hqgtbz0462wxnjpdbk',
              quantity: checkoutData.items[0]?.quantity || 1,
            }
          ],
          customer: checkoutData.customer,
          customData: {
            ...checkoutData.customData,
            vercelDomain: currentDomain,
            deployment: 'vercel-sandbox'
          },
          successUrl: checkoutData.successUrl || `${currentDomain}/success`,
          closeUrl: checkoutData.closeUrl || `${currentDomain}/failed`,
          settings: {
            theme: 'light',
            displayMode: 'overlay',
            allowLogout: true,
          }
        };

        console.log('Paddle checkout data for Vercel:', JSON.stringify(paddleCheckoutData, null, 2));

        // Use Paddle.Checkout.open() with event callback
        const checkoutConfig = {
          ...paddleCheckoutData,
          eventCallback: (data: any) => {
            console.log('Paddle checkout event on Vercel:', data);
            
            // Handle different event types
            if (data && data.name) {
              if (data.name === 'checkout.completed') {
                console.log('Checkout completed on Vercel:', data);
                resolve();
              } else if (data.name === 'checkout.closed') {
                console.log('Checkout closed on Vercel:', data);
                reject(new Error('Checkout was closed'));
              } else if (data.name === 'checkout.error') {
                console.error('Checkout error on Vercel:', data);
                reject(new Error(data.error?.message || 'Checkout failed on Vercel'));
              } else if (data.name === 'checkout.loaded') {
                console.log('Checkout loaded successfully on Vercel');
              }
            } else {
              console.log('Paddle event received (no name):', data);
            }
          }
        };

        // Use Paddle.Checkout.open() as per documentation
        window.Paddle.Checkout.open(checkoutConfig);
        
        // Set timeout in case checkout doesn't complete
        setTimeout(() => {
          console.log('Checkout timeout on Vercel - assuming user closed checkout');
          reject(new Error('Checkout timeout - user may have closed checkout'));
        }, 300000); // 5 minutes timeout
        
      } catch (error) {
        console.error('Failed to open Paddle checkout on Vercel:', error);
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