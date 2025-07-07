/**
 * User fixtures for tests
 */

export const userFixtures = {
  users: {
    validUser: () => ({
      id: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f',
      email: {
        getValue: () => 'test@example.com',
      },
      name: {
        getValue: () => 'Test',
      },
    })
  }
};

// Legacy exports for backward compatibility
export const userFixture = {
  id: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f',
  email: 'test@example.com',
  name: 'Test',
};
