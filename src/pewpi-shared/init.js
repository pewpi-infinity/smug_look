/**
 * Pewpi Shared Library Initialization
 * 
 * This module provides a simple initialization wrapper for the pewpi shared services.
 * It can be imported and called from any main entry point in the application.
 * 
 * Usage:
 *   import { initPewpiServices } from './src/pewpi-shared/init.js';
 *   initPewpiServices();
 */

import { tokenService } from './token-service.js';
import { LoginComponent } from './auth/login-component.js';
import { IntegrationListener } from './integration-listener.js';

/**
 * Initialize all pewpi shared services
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableAutoTracking - Enable token auto-tracking (default: true)
 * @param {boolean} options.enableIntegrationListener - Enable integration event listener (default: true)
 * @param {boolean} options.restoreSession - Restore login session from storage (default: true)
 * @param {Function} options.onTokenCreated - Callback for token created events
 * @param {Function} options.onTokenUpdated - Callback for token updated events
 * @param {Function} options.onLoginChanged - Callback for login changed events
 * @returns {Object} - Initialized services
 */
export function initPewpiServices(options = {}) {
  const config = {
    enableAutoTracking: options.enableAutoTracking !== false,
    enableIntegrationListener: options.enableIntegrationListener !== false,
    restoreSession: options.restoreSession !== false,
    onTokenCreated: options.onTokenCreated || null,
    onTokenUpdated: options.onTokenUpdated || null,
    onLoginChanged: options.onLoginChanged || null,
    debug: options.debug !== false,
    ...options
  };

  const services = {
    tokenService: null,
    loginComponent: null,
    integrationListener: null,
    initialized: false
  };

  try {
    // Initialize Token Service Auto-Tracking
    if (config.enableAutoTracking) {
      tokenService.initAutoTracking();
      if (config.debug) {
        console.log('[Pewpi] Token service auto-tracking initialized');
      }
    }
    services.tokenService = tokenService;

    // Restore Login Session
    if (config.restoreSession) {
      const loginComponent = new LoginComponent({
        devMode: config.devMode !== false,
        onLoginSuccess: (user) => {
          if (config.debug) {
            console.log('[Pewpi] User session restored:', user);
          }
          if (config.onLoginChanged) {
            config.onLoginChanged({ user, loggedIn: true });
          }
        }
      });
      
      // The LoginComponent constructor automatically calls loadUserFromStorage()
      // which restores the session if available
      services.loginComponent = loginComponent;
      
      if (config.debug && loginComponent.currentUser) {
        console.log('[Pewpi] Session restored for user:', loginComponent.currentUser.userId);
      }
    }

    // Initialize Integration Listener
    if (config.enableIntegrationListener) {
      const listener = new IntegrationListener({
        onTokenCreated: (token) => {
          if (config.debug) {
            console.log('[Pewpi] Token created event:', token);
          }
          if (config.onTokenCreated) {
            config.onTokenCreated(token);
          }
        },
        onTokensCleared: () => {
          if (config.debug) {
            console.log('[Pewpi] Tokens cleared event');
          }
        },
        onLoginChanged: (data) => {
          if (config.debug) {
            console.log('[Pewpi] Login changed event:', data);
          }
          if (config.onLoginChanged) {
            config.onLoginChanged(data);
          }
        },
        onP2PMessage: (data) => {
          if (config.debug) {
            console.log('[Pewpi] P2P message event:', data);
          }
        },
        debug: config.debug
      });
      
      listener.start();
      services.integrationListener = listener;
      
      if (config.debug) {
        console.log('[Pewpi] Integration listener started');
      }
    }

    services.initialized = true;
    
    if (config.debug) {
      console.log('[Pewpi] All services initialized successfully');
    }

    return services;
  } catch (error) {
    console.error('[Pewpi] Error initializing services:', error);
    
    // Return partial services even on error
    services.error = error;
    return services;
  }
}

/**
 * Get the token service instance
 * @returns {Object} - Token service
 */
export function getTokenService() {
  return tokenService;
}

/**
 * Create a login component
 * @param {Object} options - Configuration options
 * @returns {LoginComponent}
 */
export function createLoginComponent(options = {}) {
  return new LoginComponent(options);
}

/**
 * Create an integration listener
 * @param {Object} options - Configuration options
 * @returns {IntegrationListener}
 */
export function createIntegrationListener(options = {}) {
  return new IntegrationListener(options);
}

// Default export for convenience
export default {
  initPewpiServices,
  getTokenService,
  createLoginComponent,
  createIntegrationListener
};
