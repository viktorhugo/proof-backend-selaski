import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MessageMapper } from '@application/mappers/message.mapper';
import { IMessageBaseResponse } from '@application/dtos/responses/message.response';
import { IUserRepository } from '@core/repositories/user.repository.interface';

export class GetAllMessagesQuery implements IQuery {
  constructor(
    public readonly userId: string
  ) {}
}

@Injectable()
@QueryHandler(GetAllMessagesQuery)
export class GetAllMessagesQueryHandler implements IQueryHandler<GetAllMessagesQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetAllMessagesQuery): Promise<IMessageBaseResponse[]> {
    console.log('Executing GetAllMessagesQuery with userId:', query.userId);
    const { userId } = query;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    const messages = await this.userRepository.getAllMessages(userId);

    // Use the mapper to convert each message to response DTO
    return messages.map(user => MessageMapper.toBaseResponse(user));
  }
}
