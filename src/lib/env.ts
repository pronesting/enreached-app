// Environment configuration for Paddle
export const env = {
  PADDLE_CLIENT_TOKEN: 'test_ebdda6dcc37ac553c3e8bc3683d',
  PADDLE_ENVIRONMENT: 'sandbox',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
if (!env.PADDLE_CLIENT_TOKEN) {
  throw new Error('Paddle client token is required');
}

if (!env.PADDLE_CLIENT_TOKEN.startsWith('test_') && !env.PADDLE_CLIENT_TOKEN.startsWith('live_')) {
  throw new Error('Paddle client token must start with "test_" or "live_"');
}

