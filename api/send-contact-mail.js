export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      code: 'method-not-allowed', 
      message: 'Method not allowed. Please use POST.' 
    });
  }

  try {
    // Parse body data (Vercel handles this automatically)
    const { full_name, phone, email, message } = req.body;

    // Validation
    if (!full_name || !phone || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        code: 'validation-error', 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        code: 'validation-error', 
        message: 'Invalid email format' 
      });
    }

    // Phone validation (basic)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        code: 'validation-error', 
        message: 'Invalid phone number' 
      });
    }

    // Log the submission (visible in Vercel logs)
    console.log('✅ Contact form submission received:', {
      full_name,
      phone,
      email,
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    // TODO: In production, integrate with email service:
    // - Resend: https://resend.com/docs
    // - SendGrid: https://docs.sendgrid.com
    // - AWS SES
    // 
    // Example with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@westerncap.in',
    //   to: 'contact@westerncap.in',
    //   subject: 'New Contact Form Submission',
    //   html: `<p><strong>Name:</strong> ${full_name}</p>...`
    // });

    // Return success response
    return res.status(200).json({ 
      success: true, 
      code: 'contact-us', 
      message: 'We have received your message and will get back to you shortly!' 
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      code: 'server-error', 
      message: 'An error occurred while processing your request. Please try again.' 
    });
  }
}
