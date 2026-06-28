# Security Recommendations Report

This document outlines key technical steps and best practices to secure the **ZENIX** website. Since this is a frontend-centric web application, the security strategy focuses on input validation, secure integration, safe hosting configurations, and network transport security.

---

## 1. Input Sanitization & XSS Prevention
Cross-Site Scripting (XSS) occurs when untrusted user input is rendered directly into the DOM as HTML code, allowing malicious scripts to run in the user's browser.

### Action Plan
* **Escape Input Data:** Before injecting user inputs (e.g., fields from the intake form) into the DOM, ensure they are escaped or inserted using secure APIs.
* **Avoid `innerHTML` for Dynamic Input:** Use `element.textContent` or `element.innerText` instead of `innerHTML` when displaying text submitted by users:
  ```javascript
  element.textContent = `Thank you ${name}!`;
  ```
* **Use DOMPurify:** If you must render HTML dynamically from user input, sanitize it using a sanitization library like **DOMPurify**.

---

## 2. Secure HTTP Headers & Hosting Configuration
Configure the web server (or hosting provider like Cloudflare, Netlify, Vercel, or Apache/Nginx) to return standard security headers.

### Core Security Headers to Implement

| Header | Purpose | Example Value |
| :--- | :--- | :--- |
| **Strict-Transport-Security (HSTS)** | Forces browsers to load the site exclusively over HTTPS. | `max-age=63072000; includeSubDomains; preload` |
| **Content Security Policy (CSP)** | Restricts resources (styles, scripts, images) that can be loaded, blocking unauthorized code injection. | `default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:;` |
| **X-Frame-Options** | Prevents clickjacking attacks by blocking the site from being loaded inside an `<iframe>` on external sites. | `DENY` or `SAMEORIGIN` |
| **X-Content-Type-Options** | Stops browsers from guessing (sniffing) MIME types, preventing execution of scripts disguised as images. | `nosniff` |
| **Referrer-Policy** | Controls how much referrer information is sent with outbound links. | `strict-origin-when-cross-origin` |

---

## 3. Contact Form Spam & Denial of Service Protection
Static contact forms are highly vulnerable to automated spam bots.

### Action Plan
* **Integrate CAPTCHA:** Add a privacy-respecting challenge-response service such as **Cloudflare Turnstile** or **hCaptcha** to the `#intake-form`.
* **Honeypot Fields:** Add a hidden input field that users cannot see but bots will autofill. If the field contains data upon submission, reject the request immediately:
  ```html
  <input type="text" name="honeypot" style="display:none;" tabindex="-1" autocomplete="off">
  ```
* **Rate Limiting:** If using a backend endpoint or service (like Formspree or EmailJS) to deliver mail, configure rate limiting based on IP addresses to prevent abuse.

---

## 4. API & Secret Management
Do not hardcode sensitive credentials (like database passwords, private API keys, or mail-service credentials) inside client-side files (`app.js`).

### Action Plan
* **Use Serverless Functions:** Run sensitive API requests inside serverless functions (e.g. Netlify Functions, Cloudflare Workers, or Vercel Serverless) where environment variables are kept private.
* **Restricted API Keys:** If you must use client-side API keys (e.g., for Google Maps or Firebase), restrict their access within their respective dashboards by specifying your site's domain as the only allowed referrer.

---

## 5. Transport Security & Subresource Integrity
* **Enforce SSL/TLS (HTTPS):** Ensure a modern TLS certificate (TLS 1.2 or 1.3) is active (e.g., through Let's Encrypt).
* **Subresource Integrity (SRI):** When loading libraries from external CDNs, append `integrity` and `crossorigin` attributes to script/style tags to verify they haven't been modified:
  ```html
  <script src="https://example.com/library.js" 
          integrity="sha384-H4x..." 
          crossorigin="anonymous"></script>
  ```
