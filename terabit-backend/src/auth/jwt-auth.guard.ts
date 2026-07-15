import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createPublicKey } from 'crypto';
import { Request } from 'express';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
  OidcTokenClaims,
  UserRole,
} from './auth.types';

interface JwkKey extends JsonWebKey {
  kid?: string;
  kty: string;
  use?: string;
  alg?: string;
  n?: string;
  e?: string;
}

interface JwksResponse {
  keys?: JwkKey[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly publicKeys = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token de acesso ausente');
    }

    try {
      const { kid } = this.readHeader(token);
      const publicKey = await this.resolvePublicKey(kid);
      const claims = await this.jwtService.verifyAsync<OidcTokenClaims>(token, {
        algorithms: ['RS256'],
        secret: publicKey,
        issuer: this.config.getOrThrow<string>('OAUTH_ISSUER'),
      });

      this.validateAudience(claims);
      const user = this.toAuthenticatedUser(claims);
      (request as AuthenticatedRequest).user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Token de acesso invalido ou expirado');
    }
  }

  private readHeader(token: string): { kid?: string } {
    const decoded = this.jwtService.decode(token, { complete: true }) as
      | { header?: { kid?: string } }
      | null;
    if (!decoded?.header) {
      throw new UnauthorizedException('Cabecalho JWT ausente');
    }
    return decoded.header;
  }

  private async resolvePublicKey(kid?: string): Promise<string> {
    if (!kid) {
      throw new UnauthorizedException('JWT sem kid');
    }
    const cached = this.publicKeys.get(kid);
    if (cached) return cached;

    const response = await fetch(this.config.getOrThrow<string>('OAUTH_JWKS_URL'));
    if (!response.ok) {
      throw new UnauthorizedException('Falha ao carregar JWKS');
    }

    const body = (await response.json()) as JwksResponse;
    for (const key of body.keys ?? []) {
      if (key.kty !== 'RSA' || !key.kid) continue;
      const publicKey = createPublicKey({
        key: key as JsonWebKey,
        format: 'jwk',
      } as never).export({
        format: 'pem',
        type: 'spki',
      });
      this.publicKeys.set(key.kid, publicKey.toString());
    }

    const publicKey = this.publicKeys.get(kid);
    if (!publicKey) {
      throw new UnauthorizedException('Chave publica do JWT nao encontrada');
    }
    return publicKey;
  }

  private validateAudience(claims: OidcTokenClaims): void {
    const expectedAudience = this.config.get<string>('OAUTH_AUDIENCE');
    if (!expectedAudience) return;

    const audiences = Array.isArray(claims.aud)
      ? claims.aud
      : claims.aud
        ? [claims.aud]
        : [];

    if (
      !audiences.includes(expectedAudience) &&
      claims.azp !== expectedAudience
    ) {
      throw new UnauthorizedException('Audience invalida');
    }
  }

  private toAuthenticatedUser(claims: OidcTokenClaims): AuthenticatedUser {
    const roles = this.extractRoles(claims);
    return {
      sub: claims.sub,
      email: claims.email,
      name: claims.name ?? claims.preferred_username ?? claims.email,
      role: roles.includes(UserRole.ADMIN) ? UserRole.ADMIN : UserRole.USER,
    };
  }

  private extractRoles(claims: OidcTokenClaims): UserRole[] {
    const clientId = this.config.get<string>('OAUTH_CLIENT_ID');
    const roleNames = new Set(
      [
        ...(claims.realm_access?.roles ?? []),
        ...(clientId
          ? (claims.resource_access?.[clientId]?.roles ?? [])
          : []),
      ].map((role) => role.toLowerCase()),
    );

    const roles: UserRole[] = [];
    if (roleNames.has('admin')) roles.push(UserRole.ADMIN);
    if (roleNames.has('user') || roles.length === 0) roles.push(UserRole.USER);
    return roles;
  }
}
