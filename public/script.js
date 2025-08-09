class ChatApp {
    constructor() {
        this.isAuthenticated = false;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupTheme();
        this.checkAuthStatus();
        this.setupTextareaAutoResize();
    }

    initializeElements() {
        // Containers
        this.loginContainer = document.getElementById('login-container');
        this.chatContainer = document.getElementById('chat-container');
        this.loadingOverlay = document.getElementById('loading-overlay');

        // Login elements
        this.loginForm = document.getElementById('login-form');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('login-btn');
        this.loginError = document.getElementById('login-error');

        // Chat elements
        this.chatHistory = document.getElementById('chat-history');
        this.chatForm = document.getElementById('chat-form');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.themeToggle = document.getElementById('theme-toggle');
    }

    setupEventListeners() {
        // Login form
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.passwordInput.addEventListener('input', () => this.validateLoginForm());

        // Chat form
        this.chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        this.messageInput.addEventListener('input', () => this.validateChatForm());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Buttons
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Handle browser back/forward
        window.addEventListener('popstate', () => this.checkAuthStatus());
    }

    setupTextareaAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            const maxHeight = parseInt(window.getComputedStyle(this.messageInput).maxHeight);
            const newHeight = Math.min(this.messageInput.scrollHeight, maxHeight);
            this.messageInput.style.height = newHeight + 'px';
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('chat-theme') || 'light';
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('chat-theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                this.isAuthenticated = true;
                this.showChatInterface();
            } else {
                this.isAuthenticated = false;
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.isAuthenticated = false;
            this.showLoginScreen();
        }
    }

    validateLoginForm() {
        const password = this.passwordInput.value.trim();
        this.loginBtn.disabled = !password;
    }

    validateChatForm() {
        const message = this.messageInput.value.trim();
        this.sendBtn.disabled = !message || this.isMessageSending();
    }

    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.sendBtn.disabled) {
                this.handleSendMessage(e);
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const password = this.passwordInput.value.trim();
        if (!password) return;

        this.setLoginLoading(true);
        this.clearLoginError();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                this.isAuthenticated = true;
                this.showChatInterface();
                this.passwordInput.value = '';
            } else {
                this.showLoginError(data.error || '비밀번호가 틀렸습니다');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showLoginError('연결에 실패했습니다. 다시 시도해주세요.');
        } finally {
            this.setLoginLoading(false);
        }
    }

    async handleSendMessage(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        if (!message || this.isMessageSending()) return;

        // Add user message to chat
        this.addMessage('user', message);
        
        // Clear input and reset height
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.validateChatForm();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    message,
                    history: this.conversationHistory
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.hideTypingIndicator();
            
            if (data.response) {
                this.addMessage('assistant', data.response);
            } else {
                this.addMessage('assistant', '죄송합니다. 메시지 처리 중 오류가 발생했습니다.');
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            
            // 더 자세한 에러 메시지
            let errorMessage = '죄송합니다. 오류가 발생했습니다.';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('401')) {
                errorMessage = '세션이 만료되었습니다. 다시 로그인해주세요.';
                setTimeout(() => this.handleUnauthorized(), 2000);
            } else if (error.message.includes('500')) {
                errorMessage = 'OpenAI API 오류입니다. 잠시 후 다시 시도해주세요.';
            }
            
            this.addMessage('assistant', errorMessage);
        }
    }

    handleLogout() {
        // Clear session
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        }).catch(error => console.error('로그아웃 오류:', error));

        // Reset state
        this.isAuthenticated = false;
        this.conversationHistory = [];
        this.clearChatHistory();
        this.showLoginScreen();
    }

    handleUnauthorized() {
        this.isAuthenticated = false;
        this.showLoginError('세션이 만료되었습니다. 다시 로그인해주세요.');
        this.showLoginScreen();
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = this.formatMessage(content);
        
        messageDiv.appendChild(messageContent);
        
        // Remove welcome message if it exists
        const welcomeMessage = this.chatHistory.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.chatHistory.appendChild(messageDiv);
        this.scrollToBottom();

        // Update conversation history
        this.conversationHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content });
        
        // Limit conversation history to prevent token overflow
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    formatMessage(content) {
        // Basic HTML escaping
        const escaped = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Format code blocks and inline code
        let formatted = escaped
            // Code blocks (```code```)
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Inline code (`code`)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold (**text**)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic (*text*)
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');

        return formatted;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span>GPT-4o가 입력 중...</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatHistory.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatHistory.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
        });
    }

    clearChatHistory() {
        this.chatHistory.innerHTML = `
            <div class="welcome-message">
                <h2>GPT-4o 채팅에 오신 것을 환영합니다</h2>
                <p>Start a conversation by typing a message below.</p>
            </div>
        `;
    }

    setLoginLoading(loading) {
        const btnText = this.loginBtn.querySelector('.btn-text');
        const spinner = this.loginBtn.querySelector('.spinner');
        
        if (loading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            this.loginBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            this.validateLoginForm();
        }
    }

    setSendLoading(loading) {
        const sendText = this.sendBtn.querySelector('.send-text');
        const sendSpinner = this.sendBtn.querySelector('.send-spinner');
        
        if (loading) {
            sendText.classList.add('hidden');
            sendSpinner.classList.remove('hidden');
            this.sendBtn.disabled = true;
        } else {
            sendText.classList.remove('hidden');
            sendSpinner.classList.add('hidden');
            this.validateChatForm();
        }
    }

    isMessageSending() {
        return this.chatHistory.querySelector('.typing-indicator') !== null;
    }

    showLoginScreen() {
        this.loginContainer.classList.remove('hidden');
        this.chatContainer.classList.add('hidden');
        this.passwordInput.focus();
    }

    showChatInterface() {
        this.loginContainer.classList.add('hidden');
        this.chatContainer.classList.remove('hidden');
        this.messageInput.focus();
        
        // Initialize chat history if empty
        if (!this.chatHistory.querySelector('.message') && !this.chatHistory.querySelector('.welcome-message')) {
            this.clearChatHistory();
        }
    }

    showLoginError(message) {
        this.loginError.textContent = message;
        this.loginError.classList.remove('hidden');
    }

    clearLoginError() {
        this.loginError.classList.add('hidden');
        this.loginError.textContent = '';
    }

    showLoadingOverlay() {
        this.loadingOverlay.classList.remove('hidden');
    }

    hideLoadingOverlay() {
        this.loadingOverlay.classList.add('hidden');
    }
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});