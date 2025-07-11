// emailSender.js
require('dotenv').config(); // Untuk memuat variabel dari .env
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Memastikan semua variabel lingkungan diatur
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error("Error: Pastikan semua variabel lingkungan (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GMAIL_USER, GMAIL_APP_PASSWORD) diatur di file .env.");
  process.exit(1); // Keluar jika ada variabel yang hilang
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Konfigurasi transporter Nodemailer untuk Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Gunakan TLS
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

async function processEmailQueue() {
  try {
    console.log(`[${new Date().toISOString()}] Memproses antrean email...`);

    // Ambil HANYA 1 email yang statusnya 'pending'
    const { data: jobs, error } = await supabaseAdmin
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(1); // Hanya ambil 1 email per siklus

    if (error) {
      console.error('Error saat mengambil email dari antrean:', error);
      return; // Keluar dari fungsi jika ada error query
    }

    if (!jobs || jobs.length === 0) {
      console.log('Tidak ada email pending.');
      return; // Keluar jika tidak ada email yang ditemukan
    }

    console.log(`Ditemukan ${jobs.length} email pending.`); // Akan selalu 1 jika ada

    // Loop untuk memproses email yang ditemukan (hanya akan 1)
    for (const job of jobs) {
      // --- PERBAIKAN BARU: Cek apakah email sudah diverifikasi di user_emails ---
      console.log(`Checking if ${job.to_email} is already verified in user_emails.`);
      const { data: userEmailEntry, error: userEmailError } = await supabaseAdmin
        .from('user_emails')
        .select('id, is_verified')
        .eq('email', job.to_email)
        .eq('is_verified', true)
        .single();

      if (userEmailError && userEmailError.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error(`Error checking user_emails for ${job.to_email}:`, userEmailError.message);
        // Lanjutkan untuk mencoba mengirim, karena ini bukan error fatal pengiriman
      }

      if (userEmailEntry && userEmailEntry.is_verified) {
        console.log(`Email ${job.to_email} sudah diverifikasi di user_emails. Mengubah status di email_queue.`);
        // Jika sudah diverifikasi, ubah status di email_queue menjadi 'verified'
        await supabaseAdmin
          .from('email_queue')
          .update({ status: 'verified', verified_at: new Date().toISOString() })
          .eq('id', job.id);
        console.log(`Status email ${job.to_email} diperbarui menjadi 'verified'. Tidak akan dikirim ulang.`);
        continue; // Lanjut ke job berikutnya (jika ada, meskipun kita batasi 1)
      }
      // --- AKHIR PERBAIKAN BARU ---

      try {
        const mailOptions = {
          from: `"CloudNest" <${GMAIL_USER}>`,
          to: job.to_email,
          subject: job.subject,
          html: job.html_body,
        };

        console.log(`Mengirim email ke: ${job.to_email} ...`);
        await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${job.to_email}`);

        // Update status email menjadi 'sent' di Supabase
        await supabaseAdmin
          .from('email_queue')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', job.id);
        console.log(`Status email untuk ${job.to_email} diperbarui menjadi 'sent'.`);

      } catch (emailError) {
        console.error(`Gagal mengirim email ke ${job.to_email}:`, emailError);
        // Update status email menjadi 'failed' jika ada error
        await supabaseAdmin
          .from('email_queue')
          .update({ status: 'failed', error_message: emailError.message })
          .eq('id', job.id);
        console.log(`Status email untuk ${job.to_email} diperbarui menjadi 'failed'.`);
      }
    }
    console.log(`[${new Date().toISOString()}] Selesai memproses antrean email.`);

  } catch (err) {
    // Menangkap error umum yang tidak tertangani di dalam try utama
    console.error('Error umum di skrip pengirim email:', err);
  }
}

// Jalankan fungsi setiap interval tertentu (misalnya, setiap 60 detik)
const INTERVAL_SECONDS = 60; // Setiap 60 detik
setInterval(processEmailQueue, INTERVAL_SECONDS * 1000);

// Jalankan fungsi sekali saat startup agar langsung aktif
processEmailQueue();

console.log(`Skrip pengirim email berjalan, memeriksa setiap ${INTERVAL_SECONDS} detik.`);