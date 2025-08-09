// Authentication middleware for session-based auth
const requireAuth = (req, res, next) => {
    // Check if user is authenticated via session
    if (req.session && req.session.authenticated === true) {
        // Refresh session activity
        req.session.lastActivity = Date.now();
        next();
    } else {
        // Return 401 Unauthorized
        res.status(401).json({ 
            error: 'Authentication required',
            message: 'Please login to access this resource'
        });
    }
};

// Optional: Check session timeout
const checkSessionTimeout = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        const lastActivity = req.session.lastActivity || req.session.cookie._expires;
        const now = Date.now();
        const timeout = 24 * 60 * 60 * 1000; // 24 hours

        if (lastActivity && (now - lastActivity > timeout)) {
            // Session has timed out
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                }
                return res.status(401).json({ 
                    error: 'Session expired',
                    message: 'Your session has expired. Please login again.'
                });
            });
        } else {
            // Update last activity
            req.session.lastActivity = now;
            next();
        }
    } else {
        next();
    }
};

module.exports = {
    requireAuth,
    checkSessionTimeout
};