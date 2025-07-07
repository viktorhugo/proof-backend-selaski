import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { MessageController } from './message.controller';

// Repositories
import { MessageRepository } from '@infrastructure/repositories/message.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { UserModule } from '../user/user.module';

// Services
import { MessageService } from '@core/services/message.service';

// Command Handlers
import { RemoveMessageCommandHandler } from '@application/commands/message/remove-message.command';
import { CreateMessageCommandHandler } from '@application/commands/message/create-message.command';
import { UserService } from '@core/services/user.service';

const commandHandlers = [
  CreateMessageCommandHandler,
  RemoveMessageCommandHandler
];

@Module({
    imports: [CqrsModule, PrismaModule, UserModule],
    controllers: [MessageController],
    providers: [
      // Services
      {
        provide: UserService,
        useClass: UserService,
      },
      {
        provide: MessageService,
        useClass: MessageService,
      },
  
      // Repository tokens
      {
        provide: 'MessageRepository', // inject by string
        useClass: MessageRepository,
      },

      // Command handlers
      ...commandHandlers,
    ],
})
export class MessageModule {}
