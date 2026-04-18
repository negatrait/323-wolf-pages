export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { email, url, source = 'audit-widget' } = body;

    // 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 2. Generate lead_id (UUID v4 format)
    const lead_id = crypto.randomUUID ? crypto.randomUUID() : generateUUID();

    // 3. Get existing audit data if URL provided (audit was already run)
    let audit_score = 0;
    let business_type = null;
    let priority = 'medium';

    if (url) {
      try {
        const auditResponse = await fetch(`${env.AUDIT_API_URL || 'https://sivussa.com'}/api/audit?url=${encodeURIComponent(url)}`);
        const auditData = await auditResponse.json();

        audit_score = auditData.score || 0;
        business_type = auditData.business_type || null;

        // Priority based on score + business type
        if (audit_score >= 80 || business_type === 'SaaS' || business_type === 'E-commerce') {
          priority = 'high';
        } else if (audit_score >= 50) {
          priority = 'medium';
        } else {
          priority = 'low';
        }
      } catch (e) {
        console.error('Audit API error:', e);
        audit_score = 0;
        priority = 'low';
      }
    }

    // 4. Store in subscribers sheet and send welcome email via webhook
    // Webhook runs on host and uses gws for Sheets + Gmail
    const now = new Date().toISOString();

    try {
      const webhookResponse = await fetch(`${env.LEAD_WEBHOOK_URL || 'http://localhost:8765'}/api/lead-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id,
          email,
          url: url || null,
          audit_score,
          business_type,
          priority,
          source,
          status: 'trial',
          created_at: now,
          updated_at: now
        })
      });

      const webhookData = await webhookResponse.json();

      if (!webhookData.success) {
        console.error('Webhook error:', webhookData);
        // Non-critical: form succeeded even if webhook fails
      }
    } catch (webhookError) {
      console.error('Webhook request error:', webhookError);
      // Non-critical: form succeeded even if webhook is down
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id,
        audit_score,
        business_type,
        priority,
        message: "You're on the list! We'll be in touch."
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }
    );
  } catch (err) {
    console.error('leads error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Service temporarily unavailable. Please try again later.' }),
      { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// Fallback UUID generator for environments without crypto.randomUUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
