import { Message } from '../entities/message.entity';

export interface IMessageRepository {
  findById(id: string): Promise<Message | null>;
  create(Message: Message): Promise<Message>;
  delete(id: string): Promise<boolean>;
}
