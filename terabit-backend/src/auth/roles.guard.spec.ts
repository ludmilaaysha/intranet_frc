import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('rejects a regular user when admin is required', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'user' } }) }),
    } as never;
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
