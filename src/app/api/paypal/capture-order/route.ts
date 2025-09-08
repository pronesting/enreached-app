import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient, createCaptureRequest } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const client = getPayPalClient();
    const captureRequest = createCaptureRequest(orderId);
    const capture = await client.execute(captureRequest);

    return NextResponse.json({
      success: true,
      orderId: capture.result.id,
      status: capture.result.status,
      amount: capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
    });

  } catch (error) {
    console.error('PayPal order capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}
