// netlify/functions/process-email-queue.js

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Pastikan semua variabel lingkungan diatur di Netlify UI
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

// Handler yang akan dipanggil oleh Netlify
exports.handler = async function(event, context) {
  console.log(`[${new Date().toISOString()}] Memproses antrean email...`);

  try {
    const { data: jobs, error } = await supabaseAdmin
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(5); // Proses hingga 5 email per panggilan

    if (error) throw error;

    if (!jobs || jobs.length === 0) {
      console.log('Tidak ada email pending.');
      return { statusCode: 200, body: 'Tidak ada email untuk diproses.' };
    }

    for (const job of jobs) {
      try {
        await transporter.sendMail({
          from: `"CloudNest" <${GMAIL_USER}>`,
          to: job.to_email,
          subject: job.subject,
          html: job.html_body,
        });
        await supabaseAdmin.from('email_queue').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', job.id);
        console.log(`Email berhasil dikirim ke ${job.to_email}`);
      } catch (emailError) {
        console.error(`Gagal mengirim email ke ${job.to_email}:`, emailError);
        await supabaseAdmin.from('email_queue').update({ status: 'failed', error_message: emailError.message }).eq('id', job.id);
      }
    }
    return { statusCode: 200, body: `Selesai memproses ${jobs.length} email.` };

  } catch (err) {
    console.error('Error umum di skrip pengirim email:', err);
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};