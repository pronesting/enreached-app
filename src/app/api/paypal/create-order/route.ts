import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient, createOrderRequest } from '@/lib/paypal';
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

    let client;
    try {
      console.log('PayPal create-order API: Creating PayPal client...');
      client = getPayPalClient();
      console.log('PayPal create-order API: PayPal client created successfully');
    } catch (clientError) {
      console.error('PayPal create-order API: Error creating client:', clientError);
      return NextResponse.json(
        { error: 'Failed to create PayPal client', details: clientError instanceof Error ? clientError.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
    // Generate unique order ID
    const customId = `enreached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order data
    const orderData = {
      amount: invoiceData.totalAmount.toFixed(2),
      currency: 'USD',
      description: `Data Processing - ${invoiceData.dataType} (${invoiceData.recordCount.toLocaleString()} records)`,
      customId,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?orderId={ORDER_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/failed`,
    };

    let orderRequest;
    try {
      orderRequest = createOrderRequest(orderData);
    } catch (requestError) {
      console.error('PayPal create-order API: Error creating order request:', requestError);
      return NextResponse.json(
        { error: 'Failed to create order request', details: requestError instanceof Error ? requestError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    let order;
    try {
      order = await client.execute(orderRequest);
    } catch (executeError) {
      console.error('PayPal create-order API: Error executing order:', executeError);
      return NextResponse.json(
        { error: 'Failed to execute order', details: executeError instanceof Error ? executeError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Store order data for later reference (in a real app, you'd store this in a database)
    const orderInfo = {
      orderId: order.result.id,
      customId,
      invoiceData,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      orderId: order.result.id,
      approvalUrl: order.result.links?.find((link: any) => link.rel === 'approve')?.href,
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
