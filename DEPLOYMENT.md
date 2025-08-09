# GPT-4 Chat Application - Deployment Guide

This guide provides comprehensive instructions for deploying the GPT-4 Chat application on multiple platforms.

## Prerequisites

Before deploying, ensure you have:

1. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Chat Password**: A secure password for application access
3. **Session Secret**: A random string for session encryption (32+ characters recommended)

## Platform Deployments

### 1. Railway Deployment

Railway provides the simplest deployment experience with automatic builds and scaling.

#### Quick Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

#### Manual Setup
1. Fork this repository or upload your code
2. Connect your GitHub repository to Railway
3. Set environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   CHAT_PASSWORD=your_secure_password_here
   SESSION_SECRET=your_random_32_char_string_here
   NODE_ENV=production
   ```
4. Deploy automatically with the included `railway.json` configuration

#### Features
- Automatic health checks at `/api/health`
- Auto-restart on failure (max 10 retries)
- Built-in load balancing
- Custom domains supported

---

### 2. Render Deployment

Render offers excellent performance with auto-scaling capabilities.

#### Quick Deploy
1. Connect your GitHub repository to Render
2. Select "Web Service" type
3. Use the included `render.yaml` for automatic configuration

#### Manual Setup
1. Create a new Web Service on Render
2. Connect your repository
3. Configure build and start commands:
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`
4. Set environment variables:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your_openai_api_key_here
   CHAT_PASSWORD=your_secure_password_here
   SESSION_SECRET=your_random_32_char_string_here
   ```
5. Set health check path: `/api/health`

#### Features
- Auto-scaling (1-3 instances based on CPU/Memory)
- Persistent disk storage (1GB)
- Custom domains with SSL
- Auto-deploy on git push

---

### 3. Vercel Deployment

Vercel is optimal for serverless deployment with global edge distribution.

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

#### Manual Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Configure environment variables in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   CHAT_PASSWORD=your_secure_password_here
   SESSION_SECRET=your_random_32_char_string_here
   NODE_ENV=production
   ```
4. Deploy with the included `vercel.json` configuration

#### Important Notes
- Serverless functions have execution time limits (60 seconds)
- Sessions are memory-based (consider external session store for production)
- Cold starts may affect initial response time

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key | `sk-...` |
| `CHAT_PASSWORD` | Yes | Password for app access | `MySecurePassword123!` |
| `SESSION_SECRET` | Yes | Secret for session encryption | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `NODE_ENV` | Recommended | Environment mode | `production` |
| `FRONTEND_URL` | Optional | Your app's URL (for CORS) | `https://myapp.com` |
| `PORT` | Optional | Server port (auto-set by platforms) | `3000` |

## Security Considerations

### Production Checklist
- [ ] Use strong, unique passwords
- [ ] Generate cryptographically secure session secrets
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Set appropriate CORS origins
- [ ] Monitor API usage and costs
- [ ] Implement proper logging
- [ ] Regular security updates

### Rate Limiting
The application includes built-in rate limiting:
- General requests: 100 per 15 minutes per IP
- Chat requests: 10 per minute per IP
- Login attempts: 5 per 15 minutes per IP

### Session Security
- Sessions expire after 24 hours
- HTTP-only cookies prevent XSS
- Secure cookies in production (HTTPS)
- SameSite protection enabled

## Monitoring and Maintenance

### Health Checks
All platforms monitor the `/api/health` endpoint:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Logging
Monitor your application logs for:
- Failed login attempts
- API errors
- Rate limit violations
- OpenAI API issues

### Performance Optimization
1. **Memory**: App uses ~50MB base memory
2. **CPU**: Low usage except during AI requests
3. **Storage**: Minimal (session data only)
4. **Bandwidth**: Depends on chat volume

## Troubleshooting

### Common Issues

#### 1. Environment Variables Missing
**Error**: "Missing required environment variables"
**Solution**: Ensure all required environment variables are set in your platform's dashboard

#### 2. OpenAI API Issues
**Error**: "Invalid OpenAI API key" or "Service temporarily unavailable"
**Solutions**:
- Verify API key is correct and active
- Check OpenAI account billing status
- Monitor rate limits and quotas

#### 3. Session Issues
**Error**: Authentication problems or frequent logouts
**Solutions**:
- Verify SESSION_SECRET is set and consistent
- Check cookie settings for your domain
- Ensure HTTPS is enabled in production

#### 4. CORS Errors
**Error**: Cross-origin request blocked
**Solution**: Set FRONTEND_URL environment variable to your app's URL

### Platform-Specific Issues

#### Railway
- Check build logs in Railway dashboard
- Verify port binding (Railway sets PORT automatically)
- Monitor resource usage in metrics

#### Render
- Review build and deploy logs
- Check service status in dashboard
- Verify health check endpoint response

#### Vercel
- Monitor function execution logs
- Check for timeout issues (60s limit)
- Verify serverless function cold start performance

## Cost Considerations

### Platform Costs
- **Railway**: ~$5-20/month (depending on usage)
- **Render**: Free tier available, paid plans start at $7/month
- **Vercel**: Generous free tier, paid plans start at $20/month

### OpenAI API Costs
- GPT-4: ~$0.03-0.06 per 1K tokens
- Monitor usage in OpenAI dashboard
- Set spending limits to prevent overages

## Scaling and Performance

### Horizontal Scaling
- **Railway**: Automatic scaling based on demand
- **Render**: Configure auto-scaling (1-3 instances)
- **Vercel**: Serverless auto-scaling

### Performance Tips
1. Implement conversation history limits (already included)
2. Use response caching for common queries
3. Monitor and optimize OpenAI token usage
4. Consider implementing request queuing for high loads

## Support and Updates

### Getting Help
1. Check application logs first
2. Verify environment variables
3. Test health endpoint: `GET /api/health`
4. Review platform-specific documentation

### Updates
1. Update dependencies regularly: `npm update`
2. Monitor for security vulnerabilities: `npm audit`
3. Keep Node.js version updated
4. Review and update OpenAI SDK

---

## Quick Reference Commands

```bash
# Local development
npm install
npm run dev

# Production build test
npm ci
npm start

# Deployment commands
vercel --prod           # Vercel
railway deploy          # Railway
# Render deploys automatically on git push
```

Choose the platform that best fits your needs:
- **Railway**: Best overall experience, great for beginners
- **Render**: Excellent performance and scaling options
- **Vercel**: Best for global distribution and serverless architecture