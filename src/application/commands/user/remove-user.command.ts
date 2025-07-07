import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';

export class RemoveUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
  ) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserCommandHandler
  implements ICommandHandler<RemoveUserCommand, { removed: boolean }>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: RemoveUserCommand): Promise<{ removed: boolean }> {
    const { userId } = command;

    const removed = await this.userService.removeUser(userId);

    // Use the mapper to convert to response DTO
    return { removed }; // Assuming the service returns a boolean indicating success
  }
}
