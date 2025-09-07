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
    showAddDiscounts?: boolean;
    showAddTaxId?: boolean;
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

      // Load Paddle.js v2 script
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
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
      // Set environment to sandbox first - this is critical
      window.Paddle.Environment.set('sandbox');
      
      // Initialize Paddle.js v2 with correct format
      window.Paddle.Initialize({
        token: clientToken,
        debug: true,
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
        console.log('Opening Paddle inline checkout...');
        
        const currentDomain = window.location.origin;
        console.log('Using domain for checkout:', currentDomain);
        
        // Inline checkout configuration with enhanced customization
        const checkoutConfig = {
          items: [
            {
              priceId: 'pri_01k4hym2hjn2tyrp6m64kre8r7',
              quantity: checkoutData.items[0]?.quantity || 1
            }
          ],
          customer: checkoutData.customer,
          customData: checkoutData.customData,
          successUrl: checkoutData.successUrl || `${currentDomain}/success`,
          closeUrl: checkoutData.closeUrl || `${currentDomain}/failed`,
          settings: {
            displayMode: 'inline',
            frameTarget: 'paddle-checkout-container',
            frameInitialHeight: '600',
            frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
            theme: 'light',
            locale: 'en',
            allowLogout: false,
            showAddDiscounts: false,
            showAddTaxId: false
          },
          eventCallback: (data: any) => {
            console.log('Checkout event:', data);
            
            if (data.name === 'checkout.completed') {
              console.log('Checkout completed successfully');
              resolve();
            } else if (data.name === 'checkout.closed') {
              console.log('Checkout was closed');
              reject(new Error('Checkout was closed'));
            } else if (data.name === 'checkout.error') {
              console.error('Checkout error:', data);
              reject(new Error(data.error?.message || 'Checkout failed'));
            } else if (data.name === 'checkout.loaded') {
              console.log('Checkout loaded successfully');
            } else {
              console.log('Other checkout event:', data);
            }
          }
        };

        console.log('Paddle inline checkout config:', JSON.stringify(checkoutConfig, null, 2));

        // Use the official Paddle.js API for inline checkout
        window.Paddle.Checkout.open(checkoutConfig);
        
        console.log('Inline checkout opened - waiting for events');
        
        // Set timeout as fallback
        setTimeout(() => {
          console.log('Checkout timeout');
          reject(new Error('Checkout timeout'));
        }, 300000); // 5 minutes
        
      } catch (error) {
        console.error('Failed to open Paddle checkout:', error);
        reject(error);
      }
    });
  }

  public async renderInlineCheckout(checkoutData: PaddleCheckoutData, containerId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Rendering Paddle inline checkout in container:', containerId);
        
        // Wait for the container to exist in the DOM
        const waitForContainer = () => {
          return new Promise<void>((resolveWait) => {
            const checkContainer = () => {
              const container = document.getElementById(containerId);
              if (container) {
                console.log('Container found:', container);
                resolveWait();
              } else {
                console.log('Container not found, retrying...');
                setTimeout(checkContainer, 100);
              }
            };
            checkContainer();
          });
        };

        waitForContainer().then(() => {
          const currentDomain = window.location.origin;
          console.log('Using domain for checkout:', currentDomain);
          
          // Inline checkout configuration with enhanced customization
          const checkoutConfig = {
            items: [
              {
                priceId: 'pri_01k4hym2hjn2tyrp6m64kre8r7',
                quantity: checkoutData.items[0]?.quantity || 1
              }
            ],
            customer: checkoutData.customer,
            customData: checkoutData.customData,
            successUrl: checkoutData.successUrl || `${currentDomain}/success`,
            closeUrl: checkoutData.closeUrl || `${currentDomain}/failed`,
            settings: {
              displayMode: 'inline',
              frameTarget: containerId,
              frameInitialHeight: '600',
              frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
              theme: 'light',
              locale: 'en',
              allowLogout: false,
              showAddDiscounts: false,
              showAddTaxId: false
            },
            eventCallback: (data: any) => {
              console.log('Checkout event:', data);
              
              if (data.name === 'checkout.completed') {
                console.log('Checkout completed successfully');
                resolve();
              } else if (data.name === 'checkout.closed') {
                console.log('Checkout was closed');
                reject(new Error('Checkout was closed'));
              } else if (data.name === 'checkout.error') {
                console.error('Checkout error:', data);
                reject(new Error(data.error?.message || 'Checkout failed'));
              } else if (data.name === 'checkout.loaded') {
                console.log('Checkout loaded successfully');
              } else {
                console.log('Other checkout event:', data);
              }
            }
          };

          console.log('Paddle inline checkout config:', JSON.stringify(checkoutConfig, null, 2));

          // Use the official Paddle.js API for inline checkout
          window.Paddle.Checkout.open(checkoutConfig);
          
          console.log('Inline checkout rendered - waiting for events');
          
          // Set timeout as fallback
          setTimeout(() => {
            console.log('Checkout timeout');
            reject(new Error('Checkout timeout'));
          }, 300000); // 5 minutes
        }).catch((error) => {
          console.error('Failed to find container:', error);
          reject(new Error('Checkout container not found'));
        });
        
      } catch (error) {
        console.error('Failed to render Paddle checkout:', error);
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