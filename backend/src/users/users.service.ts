import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants.js';
import type { DrizzleDb } from '../database/database.types.js';
import { roles, userRoles } from '../database/schema.js';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  listRoles() {
    return this.db.select().from(roles);
  }

  async getMyRoles(userId: string) {
    const rows = await this.db
      .select({
        roleId: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
        isPrimary: userRoles.isPrimary,
        assignedAt: userRoles.assignedAt,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return rows;
  }

  async setPrimaryRole(userId: string, roleCode: string) {
    const [role] = await this.db
      .select()
      .from(roles)
      .where(eq(roles.code, roleCode))
      .limit(1);

    if (!role) {
      throw new BadRequestException(`Unknown roleCode: ${roleCode}`);
    }

    const existing = await this.db
      .select()
      .from(userRoles)
      .where(
        and(eq(userRoles.userId, userId), eq(userRoles.roleId, role.id)),
      )
      .limit(1);

    await this.db
      .update(userRoles)
      .set({ isPrimary: false })
      .where(eq(userRoles.userId, userId));

    if (existing[0]) {
      await this.db
        .update(userRoles)
        .set({ isPrimary: true })
        .where(
          and(eq(userRoles.userId, userId), eq(userRoles.roleId, role.id)),
        );
    } else {
      await this.db.insert(userRoles).values({
        userId,
        roleId: role.id,
        isPrimary: true,
      });
    }

    return this.getMyRoles(userId);
  }

  async requirePrimaryRole(userId: string) {
    const mine = await this.getMyRoles(userId);
    const primary = mine.find((r) => r.isPrimary);
    if (!primary) {
      throw new NotFoundException('No primary role assigned');
    }
    return primary;
  }
}