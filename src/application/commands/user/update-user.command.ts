import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { IUserBaseResponse } from '@application/dtos/responses/user.response';
import { UserMapper } from '@application/mappers/user.mapper';

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand, IUserBaseResponse> {
  
  constructor(
    private readonly userService: UserService
  ) {}

  async execute(command: UpdateUserCommand): Promise<IUserBaseResponse> {
    const { userId, name, email } = command;

    const user = await this.userService.updateUser(userId, name, email);

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
