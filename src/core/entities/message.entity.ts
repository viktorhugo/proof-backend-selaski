import { v4 as uuid } from 'uuid';


export class Message {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;

  constructor(
    content: string,
    userId: string,
    createdAt?: Date,
    id?: string
  ) {
    this.id = id || uuid();
    this.content = content;
    this.userId = userId;
    this.createdAt = createdAt || new Date();
  }
  getId(): string {
    return this.id;
  }
}
