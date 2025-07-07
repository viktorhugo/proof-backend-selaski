import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// DTOs
import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { UpdateUserDto } from '@application/dtos/user/update-user.dto';

// Queries
import { GetUserQuery } from '@application/queries/user/get-user.query';
import { GetAllMessagesQuery } from '@application/queries/user/get-all-messages.query';

// Commands
import { UpdateUserCommand } from '@application/commands/user/update-user.command';
import { CreateUserCommand } from '@application/commands/user/create-user.command';
import { RemoveUserCommand } from '@application/commands/user/remove-user.command';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all messages for a specific user' , description: 'Returns a list of all messages for a specific user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a list of all messages for a specific user' })
  async getAllUsers(@Param('id') id: string) {
    return this.queryBus.execute(new GetAllMessagesQuery(id));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID', description: 'Returns user information' })
  @ApiParam({ name: 'id', description: 'User ID', example: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user', description: 'Create new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(
      new CreateUserCommand(
        createUserDto.name,
        createUserDto.email,
      ),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by ID', description: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(
      new UpdateUserCommand(
        id,
        updateUserDto.name,
        updateUserDto.email,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID', description: 'Delete user by ID ' })
  @ApiParam({ name: 'id', description: 'User ID', example: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async deleteUser(@Param('id') _id: string) {
    return this.commandBus.execute(
      new RemoveUserCommand(_id),
    );
  }

}
