import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { generateKeyPairSync } from 'crypto';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const jwt = new JwtService();
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const config = new ConfigService({
    OAUTH_ISSUER: 'http://localhost:8080/realms/terabit',
    OAUTH_AUDIENCE: 'terabit-web',
    OAUTH_CLIENT_ID: 'terabit-web',
    OAUTH_JWKS_URL: 'http://localhost:8080/realms/terabit/protocol/openid-connect/certs',
  });
  const guard = new JwtAuthGuard(jwt, config);

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        keys: [
          {
            ...(publicKey.export({ format: 'jwk' }) as object),
            kid: 'test-kid',
            use: 'sig',
            alg: 'RS256',
          },
        ],
      }),
    }) as never;
  });

  function context(authorization?: string) {
    const request = { headers: { authorization } };
    return {
      request,
      execution: {
        switchToHttp: () => ({ getRequest: () => request }),
      } as never,
    };
  }

  it('accepts a valid JWT and attaches its claims', async () => {
    const { request, execution } = context(
      `Bearer ${await jwt.signAsync(
        {
          sub: 'kc-user-1',
          email: 'user@example.com',
          name: 'User',
          realm_access: { roles: ['user'] },
        },
        {
          algorithm: 'RS256',
          privateKey,
          issuer: config.getOrThrow('OAUTH_ISSUER'),
          audience: config.getOrThrow('OAUTH_AUDIENCE'),
          keyid: 'test-kid',
        },
      )}`,
    );
    await expect(guard.canActivate(execution)).resolves.toBe(true);
    expect((request as { user?: { sub: string } }).user?.sub).toBe('kc-user-1');
  });

  it('rejects absent and invalid tokens', async () => {
    await expect(guard.canActivate(context().execution)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(
      guard.canActivate(context('Bearer invalid').execution),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
