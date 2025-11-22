# Nginx Setup Guide for Unifyn

Quick guide to configure nginx for Lighthouse Best Practices security headers.

## Quick Setup

### 1. Build and Deploy

```bash
bun run push:local
```

This will copy files to `/Users/ashutosh/www/unifyn` including the `nginx.conf` file.

### 2. Configure Nginx

Find your nginx site configuration file. Common locations:
- **Linux:** `/etc/nginx/sites-available/your-site`
- **macOS (Homebrew):** `/usr/local/etc/nginx/servers/your-site`
- **macOS (custom):** `/opt/homebrew/etc/nginx/servers/your-site`

### 3. Add the Include Directive

Edit your nginx server block to include the security headers:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name localhost unifyn.local;
    
    root /Users/ashutosh/www/unifyn;
    index index.html index.htm;
    
    # ✅ Include security headers and cache configuration
    include /Users/ashutosh/www/unifyn/nginx.conf;
    
    # Optional: SPA routing (if needed)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Test and Reload

```bash
# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo nginx -s reload
```

## Verify Headers Are Working

### Using curl:
```bash
curl -I http://localhost
```

You should see these headers:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src...
Cross-Origin-Opener-Policy: same-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Using Chrome DevTools:
1. Open your site in Chrome
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Click on the first request (usually the HTML document)
6. Check the "Response Headers" section

## Common Issues

### Headers not showing?

**1. Check if nginx.conf was copied:**
```bash
ls -la /Users/ashutosh/www/unifyn/nginx.conf
```

**2. Check if include path is correct:**
```bash
# Verify the path in your server block matches the actual file location
cat /path/to/your/nginx/site/config
```

**3. Check nginx error logs:**
```bash
# macOS (Homebrew)
tail -f /usr/local/var/log/nginx/error.log

# Linux
tail -f /var/log/nginx/error.log
```

**4. Reload nginx after changes:**
```bash
sudo nginx -s reload
```

### CSP blocking resources?

If you see console errors like:
```
Refused to load the script because it violates the following Content Security Policy directive...
```

Update the CSP in `nginx.conf` to allow the blocked domain, then:
```bash
bun run push:local
sudo nginx -s reload
```

### HTTPS vs HTTP

The security headers work on both HTTP and HTTPS, but for production:
- Always use HTTPS
- The HSTS header will force HTTPS for future visits
- Add SSL configuration to your nginx server block

## Full Server Block Example

Here's a complete example with SSL:

```nginx
# HTTP - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name unifyn.local;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name unifyn.local;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.crt;
    ssl_certificate_key /path/to/ssl/cert.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Site Root
    root /Users/ashutosh/www/unifyn;
    index index.html index.htm;
    
    # ✅ Include security headers and cache configuration
    include /Users/ashutosh/www/unifyn/nginx.conf;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Testing with Lighthouse

1. Make sure nginx is running with the updated configuration
2. Open Chrome DevTools
3. Go to the Lighthouse tab
4. Run audit on "Best Practices"
5. Score should be 100/100 ✅

## macOS Specific

If you installed nginx via Homebrew:

```bash
# Start nginx
brew services start nginx

# Stop nginx
brew services stop nginx

# Restart nginx
brew services restart nginx

# Test config
nginx -t

# Reload (if already running)
nginx -s reload
```

## Need Help?

Check the main documentation:
- `LIGHTHOUSE_BEST_PRACTICES_IMPROVEMENTS.md` - Full details on all improvements
- `nginx.conf` - The actual configuration file with comments

---

**Last Updated:** November 20, 2025



