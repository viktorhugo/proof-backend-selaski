import { Message } from '@core/entities/message.entity';
import { User } from '@core/entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getAllMessages(userId: string): Promise<Message[]>;
  update(user: User): Promise<User>;
  create(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}
