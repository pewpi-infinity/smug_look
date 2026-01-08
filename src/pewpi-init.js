/**
 * Pewpi Shared Services Initialization for Browser
 * 
 * This script initializes the pewpi shared services (token, auth, wallet)
 * in a browser environment. It's designed to be included in HTML pages
 * and will not break existing functionality if there are any errors.
 * 
 * Usage in HTML:
 *   <script type="module" src="./src/pewpi-init.js"></script>
 * 
 * Or include after DOM loaded:
 *   <script type="module">
 *     import './src/pewpi-init.js';
 *   </script>
 */

// Wrap everything in try-catch for backward compatibility
(async function initializePewpiServices() {
  try {
    console.log('[Pewpi] Starting initialization...');

    // Dynamic imports with error handling
    let tokenService, LoginComponent, IntegrationListener;
    
    try {
      const tokenModule = await import('./pewpi-shared/token-service.js');
      tokenService = tokenModule.tokenService || tokenModule.default;
      console.log('[Pewpi] ✓ Token service loaded');
    } catch (error) {
      console.warn('[Pewpi] Token service not available:', error.message);
    }

    try {
      const loginModule = await import('./pewpi-shared/auth/login-component.js');
      LoginComponent = loginModule.LoginComponent || loginModule.default;
      console.log('[Pewpi] ✓ Login component loaded');
    } catch (error) {
      console.warn('[Pewpi] Login component not available:', error.message);
    }

    try {
      const listenerModule = await import('./pewpi-shared/integration-listener.js');
      IntegrationListener = listenerModule.IntegrationListener || listenerModule.default;
      console.log('[Pewpi] ✓ Integration listener loaded');
    } catch (error) {
      console.warn('[Pewpi] Integration listener not available:', error.message);
    }

    // Initialize Token Service Auto-Tracking
    if (tokenService && typeof tokenService.initAutoTracking === 'function') {
      try {
        tokenService.initAutoTracking();
        console.log('[Pewpi] ✓ Token auto-tracking initialized');
      } catch (error) {
        console.error('[Pewpi] Error initializing token auto-tracking:', error);
      }
    }

    // Restore Login Session
    if (LoginComponent) {
      try {
        const loginComponent = new LoginComponent({
          devMode: true, // Set to false in production
          onLoginSuccess: (user) => {
            console.log('[Pewpi] ✓ User session restored:', user.userId);
            
            // Emit custom event for app-level integration
            window.dispatchEvent(new CustomEvent('pewpi.initialized', {
              detail: { user, loggedIn: true }
            }));
          },
          onLoginError: (error) => {
            console.warn('[Pewpi] Login error:', error);
          }
        });

        // Check if session was restored
        if (loginComponent.currentUser) {
          console.log('[Pewpi] ✓ Session restored for user:', loginComponent.currentUser.userId);
        } else {
          console.log('[Pewpi] No existing session found');
        }

        // Make login component available globally for easy access
        window.pewpiLogin = loginComponent;
      } catch (error) {
        console.error('[Pewpi] Error restoring login session:', error);
      }
    }

    // Initialize Integration Listener
    if (IntegrationListener) {
      try {
        const listener = new IntegrationListener({
          onTokenCreated: (token) => {
            console.log('[Pewpi] Token created:', token.type, token.tokenId);
          },
          onTokenUpdated: (token) => {
            console.log('[Pewpi] Token updated:', token.tokenId);
          },
          onTokensCleared: () => {
            console.log('[Pewpi] Tokens cleared');
          },
          onLoginChanged: (data) => {
            console.log('[Pewpi] Login changed:', data.loggedIn ? 'logged in' : 'logged out');
          },
          onP2PMessage: (data) => {
            console.log('[Pewpi] P2P message received:', data);
          },
          debug: true
        });

        listener.start();
        console.log('[Pewpi] ✓ Integration listener started');

        // Make listener available globally
        window.pewpiListener = listener;
      } catch (error) {
        console.error('[Pewpi] Error starting integration listener:', error);
      }
    }

    // Make token service available globally
    if (tokenService) {
      window.pewpiTokenService = tokenService;
    }

    console.log('[Pewpi] ✓ All services initialized successfully');
    
    // Emit initialization complete event
    window.dispatchEvent(new CustomEvent('pewpi.services.ready', {
      detail: {
        tokenService: !!tokenService,
        loginComponent: !!LoginComponent,
        integrationListener: !!IntegrationListener
      }
    }));

  } catch (error) {
    // Catch-all error handler - log but don't break the page
    console.error('[Pewpi] Critical error during initialization:', error);
    console.error('[Pewpi] Pewpi services may not be available, but the app should continue to work');
  }
})();
