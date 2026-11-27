import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service.js';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('meta/roles')
  listRoles() {
    return this.users.listRoles();
  }

  @Get('me/roles')
  @UseGuards(AuthGuard)
  myRoles(@Session() session: UserSession) {
    return this.users.getMyRoles(session.user.id);
  }

  @Put('me/roles/primary')
  @UseGuards(AuthGuard)
  setPrimary(
    @Session() session: UserSession,
    @Body() body: { roleCode: string },
  ) {
    return this.users.setPrimaryRole(session.user.id, body.roleCode);
  }
}