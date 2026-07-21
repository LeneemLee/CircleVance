# Deployment and Email Plan

## Recommended setup

Use Cloudflare Pages for the website and Zoho Mail for the business mailbox.

Reasons:

- The website is static, so Cloudflare Pages is fast, simple, and inexpensive.
- The domain can stay registered at Porkbun while DNS is managed by Cloudflare.
- Zoho Mail is cost-effective for a small company that mainly needs professional domain email.
- Google Workspace or Microsoft 365 are better if the company also needs shared Drive, Docs, Teams, or enterprise admin features.

## Website deployment

1. Create a Cloudflare account.
2. Add the domain to Cloudflare.
3. In Porkbun, open the domain details and change the nameservers to the two Cloudflare nameservers shown in Cloudflare.
4. In Cloudflare, create a Pages project.
5. Deploy this folder as a static site:
   - Build command: leave empty
   - Output directory: `/`
6. Add custom domains in Cloudflare Pages:
   - `cyclevance.com`
   - `www.cyclevance.com`
7. Cloudflare will create or suggest the required DNS records.

Nameserver changes can take time to propagate. Porkbun says authoritative nameserver changes can take up to 48 hours.

## Email deployment

### Recommended paid mailbox

Use Zoho Mail and create:

- `info@CycleVance.com`

In Zoho Mail, add the domain and follow the domain verification steps. Then add Zoho's MX, SPF, and DKIM records in Cloudflare DNS.

### Alternative

Use Google Workspace if the team prefers Gmail and Google Drive. Use Microsoft 365 if the team prefers Outlook, Excel, Teams, and OneDrive.

### Not enough for full email

Cloudflare Email Routing can forward incoming email addresses, but it is not a full mailbox by itself. It is useful for aliases, not as the main company email system.

## Site updates needed before launch

- Confirm `info@CycleVance.com` is the preferred public mailbox.
- Add company address, phone number, and legal name if available.
- Add resin certifications or quality documents if the company has them.
