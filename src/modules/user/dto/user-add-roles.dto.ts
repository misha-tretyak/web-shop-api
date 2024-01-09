import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserAddRolesDto {
  @ApiProperty({ required: true, type: 'string', format: 'uuid', default: '7b03d4d6-d404-4597-a0f7-6128e84c244e' })
  @IsUUID(4)
  userUuid: string;

  @ApiProperty({
    required: true,
    isArray: true,
    type: 'string',
    format: 'uuid',
    default: ['7b03d4d6-d404-4597-a0f7-6128e84c244e'],
  })
  @IsUUID(4, { each: true })
  roleUuids: string[];
}
