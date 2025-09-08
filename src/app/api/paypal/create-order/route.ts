import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { InvoiceData } from '@/types';

export async function POST(request: NextRequest) {
  console.log('PayPal create-order API: Starting request');
  try {
    const invoiceData: InvoiceData = await request.json();
    console.log('PayPal create-order API: Invoice data received:', {
      email: invoiceData.userDetails?.email,
      totalAmount: invoiceData.totalAmount,
      dataType: invoiceData.dataType,
      recordCount: invoiceData.recordCount
    });
    
    // Validate required fields
    if (!invoiceData.userDetails.email || !invoiceData.totalAmount) {
      console.error('PayPal create-order API: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const customId = `enreached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enreached-app.vercel.app';
    const orderData = {
      amount: invoiceData.totalAmount.toFixed(2),
      currency: 'USD',
      description: `Data Processing - ${invoiceData.dataType} (${invoiceData.recordCount.toLocaleString()} records)`,
      customId,
      returnUrl: `${baseUrl}/success`,
      cancelUrl: `${baseUrl}/failed`,
    };

    console.log('Order data being sent to PayPal:', orderData);

    let order;
    try {
      console.log('PayPal create-order API: Creating PayPal order...');
      order = await createPayPalOrder(orderData);
      console.log('PayPal create-order API: Order created successfully');
    } catch (orderError) {
      console.error('PayPal create-order API: Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: orderError instanceof Error ? orderError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Store order data for later reference (in a real app, you'd store this in a database)
    const orderInfo = {
      orderId: order.id,
      customId,
      invoiceData,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
    };

    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;
    
    console.log('PayPal create-order API: Order created successfully', {
      orderId: order.id,
      approvalUrl,
      customId
    });

    return NextResponse.json({
      orderId: order.id,
      approvalUrl,
      customId,
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
