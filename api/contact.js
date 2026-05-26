import { Resend } from 'resend'

// ── In-memory rate limiter (resets on cold start — sufficient for basic spam protection) ──
const rateLimitMap = new Map()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 3

function isRateLimited(ip) {
  const now = Date.now()
  const rec = rateLimitMap.get(ip)

  if (!rec || now > rec.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (rec.count >= MAX_REQUESTS) return true
  rec.count++
  return false
}

// ── Input sanitization ───────────────────────────────────────────────
function sanitize(val, max = 500) {
  if (typeof val !== 'string') return ''
  return val.replace(/<[^>]*>/g, '').slice(0, max).trim()
}

// ── reCAPTCHA v3 verification ────────────────────────────────────────
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true // skip verification in dev when key is not set
  if (!token) return false

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = await res.json()
    return data.success && (data.score ?? 1) >= 0.5
  } catch {
    return false
  }
}

// ── Email HTML template ───────────────────────────────────────────────
function buildEmailHtml({ name, email, message, role }) {
  const roleRow = role
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#676668;width:90px;">Role</td><td style="padding:6px 0;">${role}</td></tr>`
    : ''
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#010003;background:#F8F8F6;">
  <div style="background:linear-gradient(135deg,#F7D3E9,#FBF1B9);padding:20px 24px;border-radius:16px;margin-bottom:20px;">
    <h1 style="margin:0;font-size:18px;font-weight:700;">New Contact Message</h1>
    <p style="margin:4px 0 0;font-size:13px;color:#343335;">From the BackBonz website</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <tr><td style="padding:6px 0;font-size:13px;color:#676668;width:90px;">Name</td><td style="padding:6px 0;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:6px 0;font-size:13px;color:#676668;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#1455B3;text-decoration:none;">${email}</a></td></tr>
    ${roleRow}
  </table>
  <div style="background:#fff;border:1px solid #DADADA;border-radius:12px;padding:16px;">
    <p style="margin:0 0 8px;font-size:12px;color:#676668;text-transform:uppercase;letter-spacing:.05em;">Message</p>
    <p style="margin:0;line-height:1.65;white-space:pre-wrap;">${message}</p>
  </div>
  <hr style="border:none;border-top:1px solid #DADADA;margin:20px 0;">
  <p style="font-size:11px;color:#99999A;margin:0;">Sent from backbonz.com &mdash; never stored</p>
</body>
</html>`
}

// ── Handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Rate limit by IP
  const ip =
    (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Too many requests. Please wait a minute and try again.' })
  }

  // Sanitize and validate inputs
  const { recaptchaToken, ...body } = req.body ?? {}
  const name = sanitize(body.name, 100)
  const email = sanitize(body.email, 254)
  const message = sanitize(body.message, 2000)
  const role = sanitize(body.role, 60)

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Name is required (minimum 2 characters).' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' })
  }
  if (!message || message.length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters.' })
  }

  // reCAPTCHA verification
  const captchaOk = await verifyRecaptcha(recaptchaToken)
  if (!captchaOk) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' })
  }

  // Send email via Resend
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev mode: log and return success so the form can be tested locally
    console.log('[contact] RESEND_API_KEY not set — dev mode, skipping email', { name, email, role })
    return res.status(200).json({ message: 'Message received (dev mode — email not sent).' })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'admin.backbonz@gmail.com'
  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: 'BackBonz Website <noreply@backbonz.com>',
      to: [toEmail],
      replyTo: email,
      subject: `New contact from ${name}${role ? ` (${role})` : ''}`,
      html: buildEmailHtml({ name, email, message, role }),
    })
    return res.status(200).json({ message: 'Message sent successfully!' })
  } catch (err) {
    console.error('[contact] Resend error:', err)
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' })
  }
}
