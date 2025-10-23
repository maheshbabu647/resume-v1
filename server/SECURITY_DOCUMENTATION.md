# 🔒 AI Route Security Documentation

## Overview

This document outlines the comprehensive security measures implemented to protect AI-powered endpoints while maintaining a "freemium" user experience strategy.

## 🎯 Product Strategy

### Free Tier (No Authentication Required)
Users can **try before signup** for these features:
- ✅ **ATS Score Analysis** - Analyze resume compatibility with job descriptions
- ✅ **Resume Parsing** - Parse and extract data from resume files
- ✅ **Field Enhancement** - AI-powered content improvement for individual fields

### Premium Tier (Authentication Required)
These features require users to sign up:
- 🔐 **Get Optimized Resume** - Generate fully optimized resume based on ATS analysis
- 🔐 **Enhance Entire Resume** - Comprehensive AI enhancement of all resume content
- 🔐 **Generate Summary** - AI-powered professional summary generation
- 🔐 **Cover Letter Generation** - Create tailored cover letters

## 🛡️ Security Layers

### 1. Tiered Rate Limiting

All AI endpoints use **smart rate limiting** that differentiates between free and authenticated users:

#### ATS Score Analysis
- **Free Users**: 3 requests per hour (enough to try the feature)
- **Authenticated Users**: 20 requests per hour
- **Strategy**: Let users experience the value before forcing signup

#### Resume Parsing
- **Free Users**: 5 requests per hour (parse multiple resume formats)
- **Authenticated Users**: 30 requests per hour
- **Strategy**: Allow users to import and test with their own data

#### Field Enhancement
- **Free Users**: 10 requests per hour (try AI writing assistance)
- **Authenticated Users**: 50 requests per hour
- **Strategy**: Users can enhance several fields to see quality

#### Premium Features (Auth Required)
- **ATS Optimization**: 10 requests per hour
- **Enhance Entire Resume**: 5 requests per hour
- **Generate Summary**: 5 requests per minute
- **Cover Letter Generation**: 10 requests per 15 minutes

### 2. Cost Monitoring & Circuit Breakers

Prevents runaway AI costs with **real-time budget tracking**:

#### Daily Cost Limits
```javascript
Free Tier Total:     $10.00/day   // All free users combined
Per IP (Free):       $0.50/day    // Each unique IP
Auth Tier Total:     $50.00/day   // All authenticated users
Per User (Auth):     $5.00/day    // Each individual user
```

#### Cost Estimates per Operation
```javascript
ATS Analysis:        $0.02
ATS Optimization:    $0.05
Resume Parsing:      $0.015
Field Enhancement:   $0.01
Summary Generation:  $0.02
Enhance Entire:      $0.08
Cover Letter:        $0.03
```

#### Circuit Breaker Behavior
When limits are reached:
- **Free users**: Prompted to sign up for higher limits
- **Authenticated users**: Informed about daily reset time
- **System-wide**: Emergency brake if total budget exceeded

### 3. Request Validation

Multiple validation layers protect against abuse:

#### File Upload Validation
- **Max file size**: 10MB (enforced by multer)
- **Warning threshold**: 5MB (logged for monitoring)
- **Allowed types**: PDF, DOCX, DOC, TXT
- **MIME type verification**: Double-checked

#### Text Input Validation
- **Max length**: 50,000 characters (~50KB)
- **Pattern detection**: Excessive caps, special characters
- **Suspicious content**: Logged but not blocked (monitoring)

#### Field Enhancement Validation
- **Max combined length**: 5,000 characters per request
- **Required fields**: Field name validation
- **Context checking**: Prevents empty/malformed requests

### 4. Suspicious Activity Detection

Real-time monitoring of abuse patterns:

#### What's Monitored
- Rapid repeated requests (>10 requests/minute from same IP)
- Large file uploads (>5MB)
- Unusual text patterns (excessive caps, special chars)
- Failed authentication attempts
- Rate limit violations

#### Response
- **Logged**: All suspicious activity tracked
- **Not blocked**: Doesn't interfere with legitimate users
- **Monitored**: Used for identifying attack patterns

### 5. Authentication Strategies

#### Optional Authentication (`optionalAuth` middleware)
- Checks for JWT token in cookies
- If present and valid: treats as authenticated user (higher limits)
- If absent or invalid: treats as free user (lower limits)
- **Never fails**: Always proceeds to allow free tier access

#### Required Authentication (`userAuthorization` middleware)
- Checks for valid JWT token
- Returns 401 if not authenticated
- Used for premium features only

### 6. Defense in Depth

Multiple protection layers ensure security even if one fails:

```
Request Flow:
├─ 1. Global Rate Limiter (100 req/15min per IP)
├─ 2. Optional Auth Check (extract user if present)
├─ 3. Suspicious Activity Detector
├─ 4. Tiered Rate Limiter (based on auth status)
├─ 5. Request Validation (size, format, content)
├─ 6. Cost Circuit Breaker (budget check)
├─ 7. Controller Logic (business logic)
└─ 8. Cost Recording (track actual usage)
```

## 📊 Monitoring & Logging

### What's Logged
- ✅ All AI endpoint access (IP, user, timestamp)
- ✅ Rate limit hits (who, when, which limit)
- ✅ Cost tracking (operation type, cost, daily totals)
- ✅ Suspicious patterns (rapid requests, large files)
- ✅ Authentication events (success, failures)
- ✅ Circuit breaker activations (budget exceeded)

### Hourly Cost Reports
Every hour, the system logs:
```
[CostMonitor][Hourly] 
  Date: 2025-10-22
  Free: $2.45 (24.5% of limit)
  Auth: $8.20 (16.4% of limit)
  Total: $10.65
```

## 🚨 Security Alerts

### When to Investigate
1. **Free tier exceeds $8/day** (80% of limit)
2. **Single IP exceeds $0.40/day** (80% of limit)
3. **>100 suspicious activity logs per hour**
4. **Circuit breakers triggering frequently**
5. **Unusual traffic patterns** (geographic, time-based)

## 🔧 Configuration

### Adjusting Limits

Edit `server/middleware/tiered-rate-limit.js`:
```javascript
// Change rate limits
freeMax: 3,  // Free tier requests per window
authMax: 20, // Authenticated requests per window
windowMs: 60 * 60 * 1000, // Time window (1 hour)
```

Edit `server/middleware/cost-monitor.js`:
```javascript
// Change cost limits
DAILY_LIMITS = {
  free_tier_total: 10.00,    // Total free budget
  per_ip_free: 0.50,          // Per IP budget
  authenticated_total: 50.00, // Total auth budget
  per_user_authenticated: 5.00 // Per user budget
}
```

### Production Recommendations

For production deployment:

1. **Use Redis** for rate limiting (not in-memory)
   ```javascript
   import RedisStore from 'rate-limit-redis'
   // Configure rate limiters with Redis
   ```

2. **Use Database** for cost tracking (persistence)
   ```javascript
   // Store cost data in MongoDB/PostgreSQL
   ```

3. **Add Monitoring Service** (DataDog, New Relic, etc.)
   ```javascript
   // Send metrics to monitoring service
   ```

4. **Implement CAPTCHA** for repeated requests
   ```javascript
   // After 3 free requests, require CAPTCHA
   ```

5. **Add Request Signing** for API access
   ```javascript
   // HMAC signatures for legitimate integrations
   ```

## 🎓 Best Practices

### For Developers

1. **Always use cost tracking** on new AI endpoints
2. **Set conservative limits** initially, increase based on data
3. **Monitor logs** for the first week after deployment
4. **Test rate limits** with automation tools
5. **Document cost estimates** for new AI operations

### For Operations

1. **Review cost reports daily** (first month)
2. **Adjust limits** based on actual usage patterns
3. **Monitor for spikes** in free tier usage
4. **Track conversion rate** (free → authenticated)
5. **Set up alerts** for budget thresholds

## 📈 Expected Results

### Cost Savings
- **Before**: Unlimited AI access → **Unbounded costs**
- **After**: Tiered limits + circuit breakers → **$10-50/day budget**

### User Experience
- **Free users**: Can fully experience product quality
- **Conversion**: Higher signup rate due to value demonstration
- **Friction**: Minimal (only asked to signup for premium features)

### Security
- **Attack Surface**: Significantly reduced
- **Abuse Prevention**: Multiple layers of protection
- **Cost Control**: Budget-based circuit breakers
- **Monitoring**: Full visibility into usage patterns

## 🔍 Testing

### Testing Rate Limits
```bash
# Test free tier limit (should fail after 3 requests in 1 hour)
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/ats-score/analyze \
    -F "resume=@test-resume.pdf" \
    -F "jobDescription=@test-job.pdf"
done

# Test with authentication (should allow 20 requests)
# Login first, then repeat with cookies
```

### Testing Cost Limits
```bash
# Simulate reaching daily limit
# See server/middleware/cost-monitor.js for test mode
```

## 📝 Maintenance

### Daily Tasks
- [ ] Review cost report logs
- [ ] Check for suspicious activity patterns
- [ ] Monitor conversion rates

### Weekly Tasks
- [ ] Analyze usage trends
- [ ] Adjust limits if needed
- [ ] Review and clean up old tracking data

### Monthly Tasks
- [ ] Comprehensive security audit
- [ ] Cost optimization review
- [ ] Update documentation

---

## 🆘 Troubleshooting

### "Rate limit exceeded" for legitimate users
- Check if user is authenticated (higher limits)
- Review windowMs setting (might be too restrictive)
- Consider implementing user-specific limit increases

### High costs despite limits
- Verify circuit breakers are working
- Check for cost estimate accuracy
- Look for missing cost tracking on new endpoints

### False positives in suspicious activity
- Tune detection thresholds
- Whitelist legitimate heavy users
- Adjust pattern matching rules

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
**Maintainer**: Development Team


