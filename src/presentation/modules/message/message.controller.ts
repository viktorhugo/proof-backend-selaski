import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// DTOs
import { CreateMessageDto } from '@application/dtos/message/create-message.dto';


// Commands
import { CreateMessageCommand } from '@application/commands/message/create-message.command';
import { RemoveMessageCommand } from '@application/commands/message/remove-message.command';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new message ', description: 'Create new message for a user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Message created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.commandBus.execute(
      new CreateMessageCommand(
        createMessageDto.userId,
        createMessageDto.content,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete message by ID ', description: 'Delete message by ID'})
  @ApiParam({ name: 'id', description: 'Message ID', example: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Message deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Message not found' })
  async deleteMessage(@Param('id') id: string) {
    await this.commandBus.execute(new RemoveMessageCommand(id));
    return { message: 'Message deleted successfully' };
  }

}
