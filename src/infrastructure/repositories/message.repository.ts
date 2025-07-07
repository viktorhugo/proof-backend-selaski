import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IMessageRepository } from '@core/repositories/message.repository.interface';
import { Message } from '@core/entities/message.entity';
import { BaseRepository } from './base.repository';
import {
  Message as PrismaMessage,
} from '@prisma/client';

type MessagePrismaType = PrismaMessage;


@Injectable()
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Message | null> {
    return this.executeWithErrorHandling(
      'findById', 
      async () => {
        const userRecord = await this.prisma.message.findUnique({
          where: { id }
        });

        if (!userRecord) {
          return null;
        }
        return this.mapToMessageModel(userRecord);
      }
    );
  }

  async create(Message: Message): Promise<Message> {
      const result = this.executeWithErrorHandling(
        'create', 
        async () => {
          const createdMessage = await this.prisma.message.create({
            data: {
              id: Message.id,
              content: Message.content,
              createdAt: Message.createdAt,
              userId: Message.userId,
            },
          });
  
          return this.mapToMessageModel(createdMessage);
        }
      );
      return result as Promise<Message>;
    }

  async delete(id: string): Promise<boolean> {
    const result = await this.executeWithErrorHandling(
      'delete', 
      async () => {
        await this.prisma.message.delete({
          where: { id },
        });
        return true;
      }, 
      false
    );
    return result ?? false;
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
