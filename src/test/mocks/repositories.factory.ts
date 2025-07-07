import { Name } from '../../core/value-objects/name.vo';
/**
 * Factory functions for repository mocks to be used in tests
 */

import {
  mockUserRepository,
  mockMessageRepository,
} from './repositories.mock';

/**
 * Create a fresh mock user repository for testing
 */
export const createMockUserRepository = () => ({
  ...mockUserRepository,
  findById: jest.fn().mockImplementation(mockUserRepository.findById),
  create: jest.fn().mockImplementation(userData => {
    return Promise.resolve({
      id: '550e8400-e29b-41d4-a716-446655440099',
      ...userData,
      email: {
        getValue: () => userData.email,
      },
      name: {
        getValue: () => userData.Name,
      }
    });
  }),
  update: jest.fn().mockImplementation(user => {
    return Promise.resolve({
      ...user,
      email: user.email || { getValue: () => 'updated@example.com' },
      name: user.name || { getValue: () => 'Updated' },
    });
  }),
  delete: jest.fn().mockResolvedValue(true),
});

/**
 * Create a fresh mock message repository for testing
 */
export const createMockMessageRepository = () => ({
  ...mockMessageRepository,
  create: jest.fn().mockImplementation(userData => {
    return Promise.resolve({
      userId: '550e8400-e29b-41d4-a716-446655440099',
      ...userData,
      email: {
        getValue: () => userData.email,
      },
      name: {
        getValue: () => userData.Name,
      }
    });
  }),
  delete: jest.fn().mockResolvedValue(true),
});
