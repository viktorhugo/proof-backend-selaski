
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
} from '@core/exceptions/domain-exceptions';
import { Email } from '@core/value-objects/email.vo';
import { Name } from '@core/value-objects/name.vo';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(
    emailStr: string,
    name: string,
  ): Promise<User> {
    // Validate email using value object
    const email = new Email(emailStr);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) throw new EntityAlreadyExistsException('User', 'email');

    // Create a new user
    const user = new User( email, new Name(name) );

    // Save the user
    return this.userRepository.create(user);
  }

  async updateUser(
    userId: string,
    name?: string,
    emailStr?: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    if (name) {
      user.name = new Name(name);
    }

    if (emailStr) {
      // Validate email using value object
      const email = new Email(emailStr);

      // Check if email is already in use by another user
      const existingUser = await this.userRepository.findByEmail(email.getValue());
      if (existingUser && existingUser.id !== userId) {
        throw new EntityAlreadyExistsException('User', 'email');
      }

      user.email = email;
    }

    return this.userRepository.update(user);
  }

  async removeUser( userId: string ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new EntityNotFoundException('User', userId);

    return this.userRepository.delete(user.id);
  }

}
