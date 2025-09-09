export async function sendOrderConfirmationEmail(data) { console.log('Sending email via Resend to:', data.userDetails.email); return { success: true }; } 
