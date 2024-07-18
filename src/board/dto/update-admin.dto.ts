import { IsInt } from 'class-validator';

export class UpdateAdminDto {
  /**
   * 변경할 유저 ID
   * @example 1
   */
  @IsInt()
  userId: number;
}
