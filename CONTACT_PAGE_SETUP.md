# Contact Page Setup Guide

## Email.js Setup

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Create a new email service (Gmail recommended)

### Step 2: Get Your Credentials
After setting up EmailJS:

1. **Public Key**: Dashboard → Account → Copy "Public Key"
2. **Service ID**: Email Services → Create/Select Service → Copy "Service ID"
3. **Template ID**: Email Templates → Create Template → Copy "Template ID"

### Step 3: Create Email Template
1. Go to Email Templates
2. Click "Create New Template"
3. Use these template variables:
   ```
   {{from_name}}
   {{from_email}}
   {{phone}}
   {{subject}}
   {{message}}
   {{to_email}}
   ```

### Step 4: Update Contact.jsx
Replace these values in `src/screens/Contact.jsx`:

```jsx
// Line 11 - Your Public Key
emailjs.init('YOUR_PUBLIC_KEY');

// Line 101 - Your Service ID and Template ID
const response = await emailjs.send(
  'YOUR_SERVICE_ID',        // Replace this
  'YOUR_TEMPLATE_ID',       // Replace this
  {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
    to_email: 'your-email@example.com' // Replace with your email
  }
);
```

---

## Google reCAPTCHA v3 Setup

### Step 1: Create reCAPTCHA Key
1. Go to https://www.google.com/recaptcha/admin/create
2. Sign in with your Google account
3. Fill in the form:
   - **Label**: UAK Transport Contact
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: localhost, your-domain.com

### Step 2: Get Your Keys
After creating reCAPTCHA:
- **Site Key**: Copy from "Site Key" field
- **Secret Key**: Copy from "Secret key" field (keep this secret!)

### Step 3: Update Contact.jsx
Replace this line in `src/screens/Contact.jsx`:

```jsx
// Line 144 - Your reCAPTCHA Site Key
<ReCAPTCHA
  ref={recaptchaRef}
  sitekey="YOUR_RECAPTCHA_SITE_KEY"  // Replace this
  onChange={handleRecaptchaChange}
/>
```

---

## Summary of Changes

✅ Created `src/screens/Contact.jsx` - Full contact page with:
- Contact information cards (Phone, Email, Address)
- Professional form with validation
- Email.js integration
- Google reCAPTCHA checkbox
- Form field validation (name, email, phone, subject, message)
- Success/error message handling
- Motion animations using Framer Motion

✅ Updated `src/App.jsx`:
- Imported Contact component
- Added `/contact` route

✅ Updated `src/components/Navbar.jsx`:
- Changed Contact link to `/contact` route

---

## How It Works

1. User fills out the contact form
2. Validation checks all fields
3. reCAPTCHA verification required
4. On submit, Email.js sends the message to your inbox
5. User sees success/error message
6. Form resets after successful submission

---

## Testing

To test locally:
1. Make sure you've added your real Email.js credentials
2. Make sure you've added your real reCAPTCHA Site Key
3. Test with valid form data
4. Check your email for the contact message

---

## Important Notes

- Keep your EmailJS Public Key (it's meant to be public)
- Never commit your Email.js Service ID code without protecting it
- The reCAPTCHA Secret Key should NEVER be exposed in frontend code
- For production, consider backend verification of reCAPTCHA
