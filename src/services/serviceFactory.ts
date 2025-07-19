/**
 * Service Factory
 *
 * Factory for creating service instances with conditional mock/real implementations.
 */

import { authService } from './auth/authService';
import { MockAuthService } from './auth/mockAuthService';

import { config } from '@/configs';
import type { IAuthService } from '@/types/services';

// Real service imports

// Mock service imports

// ================================
// Factory Configuration
// ================================

interface ServiceFactoryConfig {
  useMockServices: boolean;
  mockConfig?: {
    enableErrors?: boolean;
    errorRate?: number;
    delay?: number | { min: number; max: number };
  };
}

// ================================
// Service Factory Class
// ================================

class ServiceFactory {
  private config: ServiceFactoryConfig;
  private _auth: IAuthService | null = null;

  constructor(config?: Partial<ServiceFactoryConfig>) {
    this.config = {
      useMockServices: config?.useMockServices ?? this.shouldUseMockServices(),
      mockConfig: {
        enableErrors: true,
        errorRate: 0.1,
        delay: config?.useMockServices ? 500 : { min: 200, max: 1000 },
        ...config?.mockConfig,
      },
    };

    console.log(
      `🏭 Service Factory initialized with ${this.config.useMockServices ? 'MOCK' : 'REAL'} services`
    );
  }

  private shouldUseMockServices(): boolean {
    // Use mock services in development or test environments
    // Can be overridden with environment variable
    const envOverride = process.env['VITE_USE_MOCK_API'];
    if (envOverride !== undefined) {
      return envOverride === 'true';
    }

    // Default logic
    return config.isDevelopment || process.env['NODE_ENV'] === 'test';
  }

  // ================================
  // Auth Service
  // ================================

  get auth(): IAuthService {
    if (!this._auth) {
      if (this.config.useMockServices) {
        const mockConfig: any = {
          baseUrl: config.api.baseURL,
          delay:
            typeof this.config.mockConfig?.delay === 'number' ? this.config.mockConfig.delay : 500,
        };

        if (this.config.mockConfig?.enableErrors !== undefined) {
          mockConfig.enableErrors = this.config.mockConfig.enableErrors;
        }

        if (this.config.mockConfig?.errorRate !== undefined) {
          mockConfig.errorRate = this.config.mockConfig.errorRate;
        }

        this._auth = new MockAuthService(mockConfig);
      } else {
        this._auth = authService;
      }
    }
    return this._auth;
  }

  // ================================
  // User Service
  // ================================

  get user() {
    // TODO: Implement user service
    throw new Error('User service not implemented yet');
  }

  // ================================
  // Settings Service
  // ================================

  get settings() {
    // TODO: Implement settings service
    throw new Error('Settings service not implemented yet');
  }

  // ================================
  // File Service
  // ================================

  get file() {
    // TODO: Implement file service
    throw new Error('File service not implemented yet');
  }

  // ================================
  // Analytics Service
  // ================================

  get analytics() {
    // TODO: Implement analytics service
    throw new Error('Analytics service not implemented yet');
  }

  // ================================
  // Notification Service
  // ================================

  get notification() {
    // TODO: Implement notification service
    throw new Error('Notification service not implemented yet');
  }

  // ================================
  // Factory Methods
  // ================================

  /**
   * Switch to mock services
   */
  useMockServices(mockConfig?: ServiceFactoryConfig['mockConfig']) {
    this.config.useMockServices = true;
    if (mockConfig) {
      this.config.mockConfig = { ...this.config.mockConfig, ...mockConfig };
    }
    this.resetServices();
    console.log('🔄 Switched to MOCK services');
  }

  /**
   * Switch to real services
   */
  useRealServices() {
    this.config.useMockServices = false;
    this.resetServices();
    console.log('🔄 Switched to REAL services');
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Reset all cached service instances
   */
  private resetServices() {
    this._auth = null;
    // Reset other services as they're implemented
  }

  /**
   * Check if using mock services
   */
  isMockMode(): boolean {
    return this.config.useMockServices;
  }

  /**
   * Update mock configuration
   */
  updateMockConfig(updates: Partial<ServiceFactoryConfig['mockConfig']>) {
    this.config.mockConfig = { ...this.config.mockConfig, ...updates };
    if (this.config.useMockServices) {
      this.resetServices();
    }
  }
}

// ================================
// Factory Instance
// ================================

export const serviceFactory = new ServiceFactory();

// ================================
// Convenience Exports
// ================================

export const services = {
  get auth() {
    return serviceFactory.auth;
  },
  get user() {
    return serviceFactory.user;
  },
  get settings() {
    return serviceFactory.settings;
  },
  get file() {
    return serviceFactory.file;
  },
  get analytics() {
    return serviceFactory.analytics;
  },
  get notification() {
    return serviceFactory.notification;
  },
};

// ================================
// Development Tools
// ================================

if (config.isDevelopment && typeof window !== 'undefined') {
  // Add service factory controls to window for debugging
  (window as any).serviceFactory = {
    useMock: (mockConfig?: ServiceFactoryConfig['mockConfig']) => {
      serviceFactory.useMockServices(mockConfig);
    },
    useReal: () => {
      serviceFactory.useRealServices();
    },
    isMock: () => serviceFactory.isMockMode(),
    config: () => serviceFactory.getConfig(),
    updateMockConfig: (updates: any) => {
      serviceFactory.updateMockConfig(updates);
    },
    factory: serviceFactory,
    services,
  };

  console.log('🔧 Service Factory development tools available at window.serviceFactory');
}
