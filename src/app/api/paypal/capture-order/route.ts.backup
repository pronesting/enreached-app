import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('PayPal capture-order API: Capturing order:', orderId);
    const capture = await capturePayPalOrder(orderId);
    console.log('PayPal capture-order API: Order captured successfully');

    return NextResponse.json({
      success: true,
      orderId: capture.id,
      status: capture.status,
      amount: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
    });

  } catch (error) {
    console.error('PayPal order capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
