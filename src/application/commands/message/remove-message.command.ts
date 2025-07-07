import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MessageService } from '@core/services/message.service';

export class RemoveMessageCommand implements ICommand {
  constructor(
    public readonly id: string,
  ) {}
}

@CommandHandler(RemoveMessageCommand)
export class RemoveMessageCommandHandler
  implements ICommandHandler<RemoveMessageCommand, { removed: boolean }>
{
  constructor(private readonly messageService: MessageService) {}

  async execute(command: RemoveMessageCommand): Promise<{ removed: boolean }> {
    const { id } = command;

    const removed = await this.messageService.deleteMessage(id);

    // Use the mapper to convert to response DTO
    return { removed }; // Assuming the service returns a boolean indicating success
  }
}
