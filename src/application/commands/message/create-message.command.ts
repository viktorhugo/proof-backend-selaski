import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MessageMapper } from '@application/mappers/message.mapper';
import { IMessageBaseResponse } from '@application/dtos/responses/message.response';
import { MessageService } from '@core/services/message.service';

export class CreateMessageCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly content: string,
  ) {}
}

@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler implements ICommandHandler<CreateMessageCommand, IMessageBaseResponse> {
  
  constructor(
    private readonly messageService: MessageService
  ) {}

  async execute(command: CreateMessageCommand): Promise<IMessageBaseResponse> {
    const { userId, content } = command;

    const Message = await this.messageService.createMessage( content, userId  );

    // Use the mapper to convert to response DTO
    return MessageMapper.toBaseResponse(Message);
  }
}
