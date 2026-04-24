# Sivussa Audit Skill

Run an SEO, GEO, and AEO audit on any website via Sivussa's AI-native audit service.

## What this skill does

Submits a website URL for a comprehensive visibility audit covering:
- **SEO**: Technical health, meta tags, structured data, page speed, content optimization
- **GEO**: AI-generated response presence, authority signals
- **AEO**: FAQ readiness, featured snippet eligibility, speakable markup

## How to use

### Step 1: Submit an audit

Send a POST request to the Sivussa audit endpoint:

```bash
POST https://sivussa.com/api/audit
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Step 2: Get results

The response includes:
- Blocking issues with specific remedies
- Positive findings
- Priority-ranked recommendations
- Copy-paste ready fixes

### Pricing

- One-shot: €99
- Quarterly: €99/quarter
- Monthly: €89/month

## More information

Visit [sivussa.com](https://sivussa.com) for full details, pricing, and terms.
