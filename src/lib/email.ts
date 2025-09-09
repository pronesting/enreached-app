import { Resend } from 'resend';

export async function sendOrderConfirmationEmail(data) {
  try {
    console.log('=== EMAIL SERVICE DEBUG ===');
    console.log('Data received:', JSON.stringify(data, null, 2));
    console.log('User email:', data.userDetails?.email);
    console.log('API key available:', !!process.env.RESEND_API_KEY);
    console.log('API key length:', process.env.RESEND_API_KEY?.length || 0);
    
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not found, skipping email send');
      return { success: false, error: 'API key not configured' };
    }
    
    // Initialize Resend client only when needed
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: 'Enreached <onboarding@resend.dev>',
      to: [data.userDetails.email],
      subject: `Order Confirmation - ${data.recordCount.toLocaleString()} ${data.dataType} records`,
      html: generateEmailHTML(data),
      text: generateEmailText(data),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      tags: [
        {
          name: 'category',
          value: 'order-confirmation'
        }
      ]
    });

    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

function generateEmailHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .order-details { background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .order-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f3f4; }
        .order-item:last-child { border-bottom: none; font-weight: bold; font-size: 1.1em; }
        .highlight { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; color: #2c3e50;">Order Confirmation</h1>
        <p style="margin: 10px 0 0 0; color: #666;">Thank you for choosing Enreached!</p>
      </div>

      <p>Dear ${data.userDetails.firstName} ${data.userDetails.lastName},</p>
      
      <p>We've successfully received your order and payment. Here's a summary of your order:</p>

      <div class="order-details">
        <h3 style="margin-top: 0;">Order Details</h3>
        <div class="order-item">
          <span>Order ID:</span>
          <span>${data.orderId}</span>
        </div>
        <div class="order-item">
          <span>Data Type:</span>
          <span>${data.dataType === 'emails' ? 'Email Addresses' : 'Phone Numbers'}</span>
        </div>
        <div class="order-item">
          <span>Number of Records:</span>
          <span>${data.recordCount.toLocaleString()}</span>
        </div>
        <div class="order-item">
          <span>Price per Record:</span>
          <span>$${data.pricePerRecord.toFixed(2)}</span>
        </div>
        <div class="order-item">
          <span>Total Amount:</span>
          <span>$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div class="highlight">
        <h3 style="margin-top: 0; color: #1976d2;">🚀 We're Working on Your Data!</h3>
        <p style="margin-bottom: 0;">Our team is now processing your ${data.recordCount.toLocaleString()} ${data.dataType} records. You can expect to receive your complete report within the next <strong>24-48 hours</strong>.</p>
      </div>

      <p>We'll send you another email once your data processing is complete with download instructions.</p>

      <div class="footer">
        <p><strong>Need Help?</strong></p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to us at <a href="mailto:hello@enreached.co" style="color: #1976d2;">hello@enreached.co</a></p>
        <p>We're here to help and ensure you get the best results from your data.</p>
        <br>
        <p>Best regards,<br>The Enreached Team</p>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(data) {
  return `
Order Confirmation - ${data.recordCount.toLocaleString()} ${data.dataType} records

Dear ${data.userDetails.firstName} ${data.userDetails.lastName},

We've successfully received your order and payment. Here's a summary of your order:

Order Details:
- Order ID: ${data.orderId}
- Data Type: ${data.dataType === 'emails' ? 'Email Addresses' : 'Phone Numbers'}
- Number of Records: ${data.recordCount.toLocaleString()}
- Price per Record: $${data.pricePerRecord.toFixed(2)}
- Total Amount: $${data.totalAmount.toFixed(2)}

🚀 We're Working on Your Data!
Our team is now processing your ${data.recordCount.toLocaleString()} ${data.dataType} records. You can expect to receive your complete report within the next 24-48 hours.

We'll send you another email once your data processing is complete with download instructions.

Need Help?
If you have any questions or need assistance, please don't hesitate to reach out to us at hello@enreached.co
We're here to help and ensure you get the best results from your data.

Best regards,
The Enreached Team
  `;
}