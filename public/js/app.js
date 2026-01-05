// Infinity Research Hub - Main Application with Unified Auth & Wallet

class ResearchHub {
    constructor() {
        this.currentUser = UnifiedAuth.getCurrentUser();
        this.database = this.loadDatabase();
        this.initializeApp();
    }

    initializeApp() {
        if (!UnifiedAuth.isAuthenticated()) {
            this.setupAuthUI();
        }
        
        this.init();
        this.setupWalletSync();
        this.updateWalletDisplay();
    }

    init() {
        this.setupNavigation();
        this.setupEditor();
        this.setupSearch();
        this.loadResearchFeed();
        this.updateStats();
        this.updateUserDisplay();
    }

    // Auth UI Setup
    setupAuthUI() {
        const authBtn = document.getElementById('nav-auth-action');
        const modal = document.getElementById('auth-modal');
        const closeBtns = document.querySelectorAll('#close-modal, #close-modal-2');
        
        authBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });
        
        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                forms.forEach(f => {
                    f.classList.remove('active');
                    if (f.id === `${tabName}-form`) {
                        f.classList.add('active');
                    }
                });
            });
        });
        
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            const result = UnifiedAuth.login(username, password);
            
            if (result.success) {
                this.currentUser = result.user;
                modal.classList.remove('active');
                this.updateUserDisplay();
                this.updateWalletDisplay();
                this.showToast(`Welcome back, ${username}! 🎉`);
            } else {
                this.showAuthError(result.error);
            }
        });
        
        // Register form
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            const result = UnifiedAuth.register(username, email, password);
            
            if (result.success) {
                this.currentUser = result.user;
                modal.classList.remove('active');
                this.updateUserDisplay();
                this.updateWalletDisplay();
                this.showToast(`Welcome to Pewpi Infinity, ${username}! 🎉`);
            } else {
                this.showAuthError(result.error);
            }
        });
    }

    showAuthError(message) {
        const errorEl = document.getElementById('auth-error');
        errorEl.textContent = message;
        errorEl.classList.add('active');
        
        setTimeout(() => {
            errorEl.classList.remove('active');
        }, 5000);
    }

    updateUserDisplay() {
        const user = UnifiedAuth.getCurrentUser();
        const usernameEl = document.getElementById('nav-username');
        const authBtn = document.getElementById('nav-auth-action');
        
        if (user) {
            usernameEl.textContent = user.username;
            authBtn.textContent = 'Sign Out';
            authBtn.onclick = () => {
                UnifiedAuth.logout();
                this.currentUser = null;
                usernameEl.textContent = 'Guest';
                authBtn.textContent = 'Sign In';
                authBtn.onclick = null;
                this.showToast('Signed out successfully');
                this.updateWalletDisplay();
            };
        } else {
            usernameEl.textContent = 'Guest';
            authBtn.textContent = 'Sign In';
        }
    }

    // Database Management
    loadDatabase() {
        const db = localStorage.getItem('infinity_research_db');
        if (db) {
            return JSON.parse(db);
        }
        return {
            papers: [],
            citations: [],
            metadata: {
                created: new Date().toISOString(),
                totalPapers: 0,
                totalTokens: 0,
                researchers: []
            }
        };
    }

    saveDatabase() {
        localStorage.setItem('infinity_research_db', JSON.stringify(this.database));
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a:not(.nav-link)');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                        
                        if (targetId === 'tokens') {
                            this.loadUserPapers();
                            this.loadTransactions();
                        } else if (targetId === 'database') {
                            this.loadDatabaseView();
                        }
                    }
                });
            });
        });
    }

    // Research Feed
    loadResearchFeed() {
        const feedContainer = document.getElementById('research-feed');
        const papers = this.database.papers.slice().reverse();

        if (papers.length === 0) {
            feedContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Research Papers Yet</h3>
                    <p>Be the first to contribute! Use the Paper Editor to create your first research paper.</p>
                </div>
            `;
            return;
        }

        feedContainer.innerHTML = papers.map(paper => this.createPaperCard(paper)).join('');
    }

    createPaperCard(paper) {
        const keywords = paper.keywords ? paper.keywords.split(',').map(k => k.trim()) : [];
        const keywordTags = keywords.map(k => `<span class="keyword-tag">${this.escapeHtml(k)}</span>`).join('');
        
        const author = UnifiedAuth.getUserByUsername(paper.author);
        const authorBalance = author ? UnifiedWallet.getUserWallet(paper.author) : null;
        
        return `
            <div class="research-card" data-paper-id="${paper.id}">
                <h3>${this.escapeHtml(paper.title)}</h3>
                <div class="paper-meta">
                    <span class="author">👤 ${this.escapeHtml(paper.author)}</span>
                    <span class="tokens">📚 ${paper.tokensEarned} RT</span>
                    ${authorBalance ? `<span class="author-balance">💎 ${authorBalance.infinity_tokens}</span>` : ''}
                </div>
                <div class="abstract">${this.escapeHtml(paper.abstract.substring(0, 200))}${paper.abstract.length > 200 ? '...' : ''}</div>
                <div class="keywords">${keywordTags}</div>
                <div class="paper-actions">
                    <button onclick="window.researchHub.viewPaper('${paper.id}')">Read Paper</button>
                    <button onclick="window.researchHub.citePaper('${paper.id}')">Cite (+1 RT)</button>
                </div>
            </div>
        `;
    }

    // Paper Editor
    setupEditor() {
        const tokenizeBtn = document.getElementById('tokenize-btn');
        const saveDraftBtn = document.getElementById('save-draft-btn');

        tokenizeBtn.addEventListener('click', () => this.submitPaper());
        saveDraftBtn.addEventListener('click', () => this.saveDraft());
    }

    submitPaper() {
        if (!UnifiedAuth.isAuthenticated()) {
            this.showToast('Please sign in to publish papers');
            document.getElementById('auth-modal').classList.add('active');
            return;
        }

        const user = UnifiedAuth.getCurrentUser();
        const title = document.getElementById('paper-title').value.trim();
        const author = document.getElementById('paper-author').value.trim() || user.username;
        const keywords = document.getElementById('paper-keywords').value.trim();
        const abstract = document.getElementById('paper-abstract').value.trim();
        const content = document.getElementById('paper-content').value.trim();
        const references = document.getElementById('paper-references').value.trim();

        if (!title || !abstract || !content) {
            this.showStatus('Please fill in at least the title, abstract, and content fields.', 'error');
            return;
        }

        // Calculate tokens
        const wordCount = content.split(/\s+/).length;
        const baseTokens = Math.floor(wordCount / 100);
        
        let bonusTokens = 0;
        const avgWordsPerSentence = this.calculateReadability(content);
        if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 30) bonusTokens += 1;
        if (wordCount > 500) bonusTokens += 1;
        if (wordCount > 1000) bonusTokens += 1;
        if (content.split('.').length > 10) bonusTokens += 1;
        
        const totalTokens = Math.max(1, baseTokens + bonusTokens);

        // Create paper
        const paper = {
            id: this.generateId(),
            title,
            author,
            keywords,
            abstract,
            content,
            references,
            timestamp: new Date().toISOString(),
            userId: user.username,
            tokensEarned: totalTokens,
            reads: 0,
            citations: 0,
            metadata: {
                wordCount: wordCount
            }
        };

        this.database.papers.push(paper);
        this.database.metadata.totalPapers++;
        this.saveDatabase();

        // Add to unified wallet as research_tokens
        UnifiedWallet.earnTokens(
            'research_tokens',
            totalTokens,
            'smug_look',
            `Published: ${paper.title}`
        );

        // Also earn infinity_tokens as bonus (1 infinity per 5 research)
        const infinityBonus = Math.floor(totalTokens / 5);
        if (infinityBonus > 0) {
            UnifiedWallet.earnTokens(
                'infinity_tokens',
                infinityBonus,
                'smug_look',
                `Research bonus for ${paper.title}`
            );
        }

        this.showStatus(`Paper published! +${totalTokens} 📚 Research Tokens, +${infinityBonus} 💎 Infinity Tokens`, 'success');
        this.clearEditor();
        this.loadResearchFeed();
        this.updateStats();
        this.updateWalletDisplay();
    }

    calculateReadability(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const wordCount = content.split(/\s+/).length;
        return sentences.length > 0 ? wordCount / sentences.length : 0;
    }

    saveDraft() {
        const draft = {
            title: document.getElementById('paper-title').value,
            author: document.getElementById('paper-author').value,
            keywords: document.getElementById('paper-keywords').value,
            abstract: document.getElementById('paper-abstract').value,
            content: document.getElementById('paper-content').value,
            references: document.getElementById('paper-references').value,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem('research_draft', JSON.stringify(draft));
        this.showStatus('Draft saved successfully!', 'success');
    }

    clearEditor() {
        document.getElementById('paper-title').value = '';
        document.getElementById('paper-author').value = '';
        document.getElementById('paper-keywords').value = '';
        document.getElementById('paper-abstract').value = '';
        document.getElementById('paper-content').value = '';
        document.getElementById('paper-references').value = '';
        localStorage.removeItem('research_draft');
    }

    showStatus(message, type = 'success') {
        const statusEl = document.getElementById('editor-status');
        statusEl.textContent = message;
        statusEl.style.color = type === 'error' ? '#ef4444' : '#10b981';
        
        setTimeout(() => {
            statusEl.textContent = '';
        }, 5000);
    }

    // Citation System
    citePaper(paperId) {
        if (!UnifiedAuth.isAuthenticated()) {
            this.showToast('Please sign in to cite papers');
            document.getElementById('auth-modal').classList.add('active');
            return;
        }

        const paper = this.database.papers.find(p => p.id === paperId);
        if (!paper) return;

        // Reward original author
        UnifiedWallet.earnTokensForUser(
            paper.author,
            'research_tokens',
            1,
            'smug_look',
            `Paper cited: ${paper.title}`
        );

        // Reward citer (smaller amount)
        UnifiedWallet.earnTokens(
            'research_tokens',
            0.5,
            'smug_look',
            `Cited: ${paper.title}`
        );

        // Track citation
        paper.citations = (paper.citations || 0) + 1;
        this.saveDatabase();

        this.showToast(`Citation recorded! Author +1 RT, You +0.5 RT`);
        this.updateWalletDisplay();
    }

    viewPaper(paperId) {
        const paper = this.database.papers.find(p => p.id === paperId);
        if (!paper) return;

        paper.reads = (paper.reads || 0) + 1;
        this.saveDatabase();

        alert(`Paper: ${paper.title}\n\nBy: ${paper.author}\n\nAbstract: ${paper.abstract}\n\n(Full paper view would open in a modal)`);
    }

    // Wallet & Token Display
    setupWalletSync() {
        // Listen for wallet changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'pewpi_unified_auth' || e.key === 'pewpi_unified_wallet') {
                this.updateWalletDisplay();
                this.updateUserDisplay();
            }
        });

        // Heartbeat sync
        setInterval(() => {
            if (UnifiedAuth.isAuthenticated()) {
                this.updateWalletDisplay();
            }
        }, 5000);
    }

    updateWalletDisplay() {
        const balances = UnifiedWallet.getAllBalances();
        
        // Update main wallet display
        const infinityEl = document.getElementById('wallet-infinity');
        const researchEl = document.getElementById('wallet-research');
        const artEl = document.getElementById('wallet-art');
        const musicEl = document.getElementById('wallet-music');
        
        if (infinityEl) infinityEl.textContent = balances.infinity_tokens;
        if (researchEl) researchEl.textContent = balances.research_tokens;
        if (artEl) artEl.textContent = balances.art_tokens;
        if (musicEl) musicEl.textContent = balances.music_tokens;
        
        // Update nav display
        const navInfinity = document.getElementById('nav-wallet-infinity');
        const navResearch = document.getElementById('nav-wallet-research');
        const navArt = document.getElementById('nav-wallet-art');
        const navMusic = document.getElementById('nav-wallet-music');
        
        if (navInfinity) navInfinity.textContent = balances.infinity_tokens;
        if (navResearch) navResearch.textContent = balances.research_tokens;
        if (navArt) navArt.textContent = balances.art_tokens;
        if (navMusic) navMusic.textContent = balances.music_tokens;
        
        // Update research rank
        this.updateResearchRank(balances.research_tokens);
    }

    updateResearchRank(tokens) {
        const rankEl = document.getElementById('research-rank');
        if (!rankEl) return;
        
        let rank = 'Novice';
        if (tokens >= 100) rank = 'Expert';
        else if (tokens >= 50) rank = 'Advanced';
        else if (tokens >= 20) rank = 'Intermediate';
        else if (tokens >= 5) rank = 'Beginner';
        
        rankEl.textContent = rank;
    }

    loadTransactions() {
        const transactions = UnifiedWallet.getUserTransactions(10);
        const container = document.getElementById('transaction-list');
        
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = '<p style="color: #9fd4ff;">No recent transactions</p>';
            return;
        }
        
        container.innerHTML = transactions.map(txn => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${this.escapeHtml(txn.description)}</div>
                    <div class="transaction-meta">${new Date(txn.timestamp).toLocaleString()} • ${txn.source}</div>
                </div>
                <div class="transaction-amount ${txn.amount > 0 ? 'positive' : 'negative'}">
                    ${txn.amount > 0 ? '+' : ''}${txn.amount} ${this.getTokenIcon(txn.tokenType)}
                </div>
            </div>
        `).join('');
    }

    getTokenIcon(tokenType) {
        const icons = {
            'infinity_tokens': '💎',
            'research_tokens': '📚',
            'art_tokens': '🎨',
            'music_tokens': '🎵'
        };
        return icons[tokenType] || '🪙';
    }

    loadUserPapers() {
        const container = document.getElementById('user-papers');
        if (!container) return;
        
        const user = UnifiedAuth.getCurrentUser();
        if (!user) {
            container.innerHTML = '<div class="empty-state"><p>Sign in to see your papers</p></div>';
            return;
        }

        const userPapers = this.database.papers.filter(p => p.author === user.username);
        
        // Update papers count
        const papersCountEl = document.getElementById('papers-count');
        if (papersCountEl) papersCountEl.textContent = userPapers.length;
        
        // Update citations count
        const citationsCountEl = document.getElementById('citations-count');
        if (citationsCountEl) {
            const totalCitations = userPapers.reduce((sum, p) => sum + (p.citations || 0), 0);
            citationsCountEl.textContent = totalCitations;
        }

        if (userPapers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Papers Yet</h3>
                    <p>Create your first research paper to start earning tokens!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userPapers.map(paper => this.createPaperCard(paper)).join('');
    }

    // Search
    setupSearch() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    performSearch() {
        const query = document.getElementById('search-input').value.toLowerCase().trim();
        const results = this.database.papers.filter(paper => 
            paper.title.toLowerCase().includes(query) ||
            paper.abstract.toLowerCase().includes(query) ||
            paper.keywords.toLowerCase().includes(query) ||
            paper.content.toLowerCase().includes(query)
        );

        const container = document.getElementById('database-results');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Results Found</h3>
                    <p>Try different keywords or browse all papers.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(paper => this.createPaperCard(paper)).join('');
    }

    loadDatabaseView() {
        this.updateStats();
        const container = document.getElementById('database-results');
        
        if (this.database.papers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Database Empty</h3>
                    <p>The infinity database is waiting for research contributions.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.database.papers
            .slice().reverse()
            .map(paper => this.createPaperCard(paper))
            .join('');
    }

    updateStats() {
        const totalPapersEl = document.getElementById('total-papers');
        const totalTokensEl = document.getElementById('total-tokens');
        const activeResearchersEl = document.getElementById('active-researchers');
        
        if (totalPapersEl) totalPapersEl.textContent = this.database.papers.length;
        
        if (totalTokensEl) {
            const totalTokens = this.database.papers.reduce((sum, p) => sum + (p.tokensEarned || 0), 0);
            totalTokensEl.textContent = totalTokens;
        }
        
        if (activeResearchersEl) {
            const researchers = new Set(this.database.papers.map(p => p.author));
            activeResearchersEl.textContent = researchers.size;
        }
    }

    // Toast Notifications
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    // Utilities
    generateId() {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        const randomPart2 = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${randomPart}${randomPart2}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.researchHub = new ResearchHub();
    
    // Load draft if exists
    const draft = localStorage.getItem('research_draft');
    if (draft) {
        console.log('Draft found. You can restore it in the editor.');
    }
});
