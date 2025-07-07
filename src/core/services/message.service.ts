import { Injectable, Inject } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from '../repositories/message.repository.interface';
import {
  EntityNotFoundException,
} from '@core/exceptions/domain-exceptions';
import { IUserRepository } from '@core/repositories/user.repository.interface';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createMessage( 
    content: string, 
    userId: string, 
  ): Promise<Message> {
    // Check if a message already exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    const message = new Message( content, userId );

    return this.messageRepository.create(message);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new EntityNotFoundException('Message', id);
    }
    
    return this.messageRepository.delete(id);
  }
}
