import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient, createOrderRequest } from '@/lib/paypal';
import { InvoiceData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json();
    
    // Validate required fields
    if (!invoiceData.userDetails.email || !invoiceData.totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = getPayPalClient();
    
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

    const orderRequest = createOrderRequest(orderData);
    const order = await client.execute(orderRequest);

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
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
