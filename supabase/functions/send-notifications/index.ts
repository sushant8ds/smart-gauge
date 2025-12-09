import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

async function sendEmail(to: string, subject: string, message: string) {
  try {
    await resend.emails.send({
      from: 'Calibration System <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
        <p>Please take necessary action.</p>
        <p>Best regards,<br>Auto Gauge Calibration System</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

async function sendSMS(to: string, message: string) {
  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: fromPhone!,
          Body: message,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { notifications } = await req.json();
    
    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
    const notificationPhone = Deno.env.get('NOTIFICATION_PHONE');

    const results = [];

    for (const notification of notifications) {
      const { gage_id, notification_type, message } = notification;

      // Send Email
      const emailSent = await sendEmail(
        notificationEmail!,
        `Calibration Alert: ${notification_type}`,
        message
      );

      // Send SMS
      const smsSent = await sendSMS(notificationPhone!, message);

      // Log notification
      await supabase.from('notification_log').insert({
        gage_id,
        notification_type,
        channel: emailSent && smsSent ? 'Email+SMS' : emailSent ? 'Email' : smsSent ? 'SMS' : 'Failed',
        message,
        recipient: notificationEmail,
        status: emailSent || smsSent ? 'sent' : 'failed',
      });

      results.push({ gage_id, emailSent, smsSent });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error sending notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
