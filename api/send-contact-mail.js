export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      code: 'method-not-allowed', 
      message: 'Method not allowed' 
    });
  }

  try {
    const { full_name, phone, email, message } = req.body;

    // Basic validation
    if (!full_name || !phone || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        code: 'validation-error', 
        message: 'All fields are required' 
      });
    }

    // For now, just log the data (you'll need to integrate with an email service)
    console.log('Contact form submission:', { full_name, phone, email, message });

    // In production, integrate with:
    // - SendGrid (https://sendgrid.com)
    // - Resend (https://resend.com)
    // - AWS SES
    // - Nodemailer with SMTP
    
    // For now, return success
    return res.status(200).json({ 
      success: true, 
      code: 'contact-us', 
      message: 'Message received successfully. We will contact you soon!' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      code: 'server-error', 
      message: 'An error occurred while processing your request' 
    });
  }
}

