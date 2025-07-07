import { Message } from '@core/entities/message.entity';
import { IMessageBaseResponse } from '@application/dtos/responses/message.response';

export class MessageMapper {
  /**
   * Maps a Permission entity to a PermissionResponse DTO
   */
  static toBaseResponse(message: Message): IMessageBaseResponse {
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      userId: message.userId,
    };
  }

}
