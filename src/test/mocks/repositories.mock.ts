/**
 * Mock implementations for repositories used in tests
 */

import { userFixture } from '../fixtures/user.fixtures';

// Mock User Repository
export const mockUserRepository = {
  findById: jest.fn().mockImplementation(id => {
    if (id === userFixture.id) {
      return Promise.resolve(userFixture);
    }

    return Promise.resolve(null);
  }),

  findByEmail: jest.fn().mockImplementation(email => {
    if (email === userFixture.email) {
      return Promise.resolve(userFixture);
    }

    return Promise.resolve(null);
  }),

  create: jest.fn().mockImplementation(userData => {
    return Promise.resolve({
      id: '550e8400-e29b-41d4-a716-446655440099',
      ...userData,
      roles: ['user'],
      permissions: ['user:read'],
      isActive: true,
    });
  }),

  update: jest.fn().mockImplementation((id, userData) => {
    return Promise.resolve({
      ...(id === userFixture.id ? userFixture : {}),
      ...userData,
    });
  }),

  findAll: jest.fn().mockResolvedValue([userFixture]),
};

// Mock Message Repository
export const mockMessageRepository = {

  create: jest.fn().mockImplementation(userData => {
    return Promise.resolve({
      id: '550e8400-e29b-41d4-a716-446655440099',
      ...userData,
      roles: ['user'],
      permissions: ['user:read'],
      isActive: true,
    });
  }),

  delete: jest.fn().mockImplementation((id, userData) => {
    return Promise.resolve({
      ...(id === userFixture.id ? userFixture : {}),
      ...userData,
    });
  }),

  findAll: jest.fn().mockResolvedValue([userFixture]),
};

