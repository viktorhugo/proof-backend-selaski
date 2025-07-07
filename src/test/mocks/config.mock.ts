/**
 * Mock implementations for ConfigService used in tests
 */

export const mockConfigService = {
  get: jest.fn().mockImplementation((key, defaultValue) => {
    const config = {
      // App configuration
      PORT: 4100,
      NODE_ENV: 'test',

      // Database configuration
      DATABASE_URL: 'mysql://victor_mosquera:test1234@localhost:3306/testdb?schema=public',

    };

    return config[key] || defaultValue;
  }),
};
