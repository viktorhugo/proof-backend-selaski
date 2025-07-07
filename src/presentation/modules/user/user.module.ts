import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { UserController } from './user.controller';

// Repositories
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

// Services
import { UserService } from '@core/services/user.service';

// Query Handlers
import { GetUserQueryHandler } from '@application/queries/user/get-user.query';
import { GetAllMessagesQueryHandler } from '@application/queries/user/get-all-messages.query';

// Command Handlers
import { UpdateUserCommandHandler } from '@application/commands/user/update-user.command';
import { RemoveUserCommandHandler } from '@application/commands/user/remove-user.command';
import { CreateUserCommandHandler } from '@application/commands/user/create-user.command';


const queryHandlers = [GetUserQueryHandler, GetAllMessagesQueryHandler];

const commandHandlers = [
  UpdateUserCommandHandler,
  RemoveUserCommandHandler,
  CreateUserCommandHandler
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UserController],
  providers: [
    // Services
    {
      provide: UserService,
      useClass: UserService,
    },

    // Repository tokens
    {
      provide: 'UserRepository', // inject by string
      useClass: UserRepository,
    },

    // Query handlers
    ...queryHandlers,

    // Command handlers
    ...commandHandlers,
  ],
  exports: [UserService, 'UserRepository'],
})
export class UserModule {}
