import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { User } from '@core/entities/user.entity';
import { Email } from '@core/value-objects/email.vo';
import { Name } from '@core/value-objects/name.vo';
import { LoggerService } from '@infrastructure/logger/logger.service';
// We're using a mock record instead of the actual Prisma types

// Mock Logger
const mockLoggerService = {
  setContext: jest.fn().mockReturnThis(),
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

// Mock PrismaService
const mockPrismaService = {
  user: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    getAllMessages: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(callback => callback(mockPrismaService)),
};

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userId = '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f';
      const mockUser = createMockUserRecord(userId);

      mockPrismaService.user.findById.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findById(userId);
      console.log(`Result: ${JSON.stringify(result)}`);
      
      if (!result) {
        throw new Error('User not found');
      }

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(userId);
      expect(result.email.getValue()).toBe('test@example.com');
      expect(result.name.getValue()).toBe('John Doe');
    });

    it('should return null if user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockPrismaService.user.findById.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: expect.any(Object),
      });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      // Arrange
      const userId = '955e08d3-5368-42f8-86cd-dff23d48052a';
      mockPrismaService.user.delete.mockResolvedValue({ id: userId });

      // Act
      const result = await repository.delete(userId);

      // Assert
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const newUser = new User(
        new Email('test@example.com'),
        new Name('John Doe'),
      );

      const mockCreatedUser = createMockUserRecord(newUser.id, newUser.email.getValue());
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await repository.create(newUser);

      // Assert
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: newUser.id,
          email: newUser.email.getValue(),
          name: newUser.name.getValue(),
        }),
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(newUser.id);
    });
  });

});

// Helper function to create mock Prisma User records
function createMockUserRecord(id: string, email = 'test@example.com') {
  return {
    id,
    email,
    name: 'John Doe',
  };
}
