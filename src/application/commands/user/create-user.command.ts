import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { IUserBaseResponse } from '@application/dtos/responses/user.response';
import { UserMapper } from '@application/mappers/user.mapper';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, IUserBaseResponse> {
  
  constructor(
    private readonly userService: UserService
  ) {}

  async execute(command: CreateUserCommand): Promise<IUserBaseResponse> {
    const { name, email } = command;

    const user = await this.userService.createUser( email, name );

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
