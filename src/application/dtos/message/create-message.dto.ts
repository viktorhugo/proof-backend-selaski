import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'This is a sample message..',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'User ID of the message creator',
    example: 'uuid-1234-5678-9012-345678901234',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

}
