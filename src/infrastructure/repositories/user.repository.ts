import { Injectable } from '@nestjs/common';
import { User } from '@core/entities/user.entity';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { Email } from '@core/value-objects/email.vo';
import {  Name } from '@core/value-objects/name.vo';
import { BaseRepository } from './base.repository';
import { Message } from '@core/entities/message.entity';

import {
  User as PrismaUser,
  Message as PrismaMessage,
} from '@prisma/client';

type UserPrismaType = PrismaUser;
type MessagePrismaType = PrismaMessage;


@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  
  findById(id: string): Promise<User | null> {
    return this.executeWithErrorHandling(
      'findById', 
      async () => {
        const userRecord = await this.prisma.user.findUnique({
          where: { id }
        });

        if (!userRecord) {
          return null;
        }
        return this.mapToModel(userRecord as UserPrismaType);
      }
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.executeWithErrorHandling(
      'findByEmail', 
      async () => {
        const userRecord = await this.prisma.user.findUnique({
          where: { email }
        });

        if (!userRecord) {
          return null;
        }

        return this.mapToModel(userRecord as UserPrismaType);
      }
    );
  }

  async getAllMessages(userId: string): Promise<Message[]> {
    const resultPromise = this.executeWithErrorHandling(
      'allMessages', 
      async () => {
        const allMessages  = await this.prisma.message.findMany({
          where: { userId }
        });

        return allMessages.map(record => this.mapToMessageModel(record as MessagePrismaType));
      }
    );
    return resultPromise as Promise<Message[]>;
  }


  async create(user: User): Promise<User> {
    const result = this.executeWithErrorHandling(
      'create', 
      async () => {
        const createdUser = await this.prisma.user.create({
          data: {
            id: user.id,
            email: user.email.getValue(),
            name: user.name.getValue(),
          },
        });

        return this.mapToModel(createdUser as UserPrismaType);
      }
    );
    return result as Promise<User>;
  }

  async update(user: User): Promise<User> {
    const result = this.executeWithErrorHandling(
      'update', 
      async () => {

      // Update the user with new role associations
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email.getValue(),
          name: user.name.getValue(),
        },
      });

      return this.mapToModel(updatedUser);
    });
    return result as Promise<User>;
  }


  async delete(id: string): Promise<boolean> {
    const result = await this.executeWithErrorHandling(
      'delete', 
      async () => {
        await this.prisma.user.delete({
          where: { id },
        });
        return true;
      }, 
      false
    );
    return result ?? false;
  }

  private mapToModel(record: UserPrismaType): User {
    // Create value objects from primitive values
    const emailVO = new Email(record.email);
    const nameVO = new Name(record.name);

    const user = new User(emailVO, nameVO);

    user.id = record.id;
    user.email = emailVO;
    user.name = nameVO;

    return user;
  }

  private mapToMessageModel(record: MessagePrismaType): Message {
    // Create value objects from primitive values
    const message = new Message(
      record.content,
      record.userId,
      record.createdAt,
      record.id
    );
    return message;
  }

}
