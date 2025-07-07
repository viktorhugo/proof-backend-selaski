import { User } from '@core/entities/user.entity';
import { IUserBaseResponse } from '@application/dtos/responses/user.response';

export class UserMapper {

  /**
   * Maps a User entity to a IUserBaseResponse DTO
   */
  static toBaseResponse(user: User): IUserBaseResponse {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name.getValue(),
    };
  }

}
