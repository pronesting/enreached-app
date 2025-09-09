import { Resend } from 'resend';  
  
const resend = new Resend(process.env.RESEND_API_KEY);  
  
export async function sendOrderConfirmationEmail(data) {  
  try {  
    console.log('Sending confirmation email to:', data.userDetails.email);  
  
    const result = await resend.emails.send({  
