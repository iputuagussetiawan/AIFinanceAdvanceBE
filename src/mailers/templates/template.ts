export const verifyEmailTemplate = (url: string, brandColor: string = '#2563EB') => ({
    subject: 'Action Required: Verify your AI Finance Assistant account',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb;">
              
              <tr>
                <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                  <div style="font-size: 24px; font-weight: 800; color: ${brandColor};">AI Finance Assistant</div>
                  <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Premium Finance Assistant</div>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">Final step to join us!</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                    Hi there,<br><br>
                    Thank you for signing up for AI Finance Assistant. To ensure your account is secure and to start applying for jobs, please confirm your email address below.
                  </p>
                  
                  <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${url}" style="background-color: ${brandColor}; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 10px; display: inline-block;">
                      Confirm My Account
                    </a>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 0;">
                    <strong>Why did I receive this?</strong> This is a standard security check for new members of the AI Finance Assistant community.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 40px; background-color: #fafafa; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                  <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Help Center</a> &nbsp;&bull;&nbsp; 
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Privacy Policy</a> &nbsp;&bull;&nbsp; 
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Terms of Service</a>
                  </p>
                  
                  <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
                    AI Finance Assistant Inc. | 123 AG-DEV, Indonesia 018989<br>
                    If you didn't create an account, <a href="#" style="color: #9ca3af;">unsubscribe here</a>.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
})

export const passwordResetTemplate = (url: string, brandColor: string = '#2563EB') => ({
    subject: 'Reset Your Password',
    text: `To reset your password, please click the following link: ${url}`,
    html: `
      <html><head><style>
        body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
        .header { background-color: ${brandColor}; font-size: 24px;  font-weight:bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .header img { max-width: 40px; margin-bottom: 10px; }
        .content { padding: 20px; text-align: center; }
        .content h1 { font-size: 24px; color: #333333; }
        .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
        .button { display: inline-block; padding: 15px 25px; font-size: 16px; font-weight: bold; background-color: ${brandColor};  color: #fff !important; border-radius: 5px; text-decoration: none; margin-top: 20px; }
        .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
      </style></head><body>
        <div class="container">
          <div class="header">AI Finance Assistant</div>
          <div class="content">
            <h1>Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to proceed with resetting your password.</p>
            <a href="${url}" class="button">Reset Password</a>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          </div>
        </div>
      </body></html>
    `
})
