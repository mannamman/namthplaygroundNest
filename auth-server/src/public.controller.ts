import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('public')
@Controller('test')
export class PublicController {
  @Get('ping')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'for health check' })
  healthCheck(): string {
    return 'pong';
  }
}
