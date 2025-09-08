import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();
    
    if (!invoiceData || !invoiceData.totalAmount || !invoiceData.userDetails) {
      return NextResponse.json(
        { error: 'Invalid invoice data provided' },
        { status: 400 }
      );
    }

    console.log('PayPal create-order API: Creating order for:', {
      totalAmount: invoiceData.totalAmount,
      recordCount: invoiceData.recordCount,
      dataType: invoiceData.dataType,
      customer: `${invoiceData.userDetails.firstName} ${invoiceData.userDetails.lastName}`
    });

    // Generate a unique order ID
    const orderId = `enreached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the PayPal order
    const order = await createPayPalOrder({
      amount: invoiceData.totalAmount.toString(),
      currency: 'USD',
      description: `${invoiceData.dataType === 'emails' ? 'Email' : 'Phone'} data processing for ${invoiceData.recordCount.toLocaleString()} records`,
      customId: orderId,
      returnUrl: `${request.nextUrl.origin}/success?orderId=${orderId}`,
      cancelUrl: `${request.nextUrl.origin}/failed?orderId=${orderId}`,
    });

    console.log('PayPal create-order API: Order created successfully:', order.id);

    // Find the approval URL from the order response
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal order response');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: approvalUrl,
      status: order.status,
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create PayPal order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
