"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const auth_types_1 = require("./auth.types");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    config;
    publicKeys = new Map();
    constructor(jwtService, config) {
        this.jwtService = jwtService;
        this.config = config;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const [scheme, token] = authorization?.split(' ') ?? [];
        if (scheme !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Token de acesso ausente');
        }
        try {
            const { kid } = this.readHeader(token);
            const publicKey = await this.resolvePublicKey(kid);
            const claims = await this.jwtService.verifyAsync(token, {
                algorithms: ['RS256'],
                secret: publicKey,
                issuer: this.config.getOrThrow('OAUTH_ISSUER'),
            });
            this.validateAudience(claims);
            const user = this.toAuthenticatedUser(claims);
            request.user = user;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Token de acesso invalido ou expirado');
        }
    }
    readHeader(token) {
        const decoded = this.jwtService.decode(token, { complete: true });
        if (!decoded?.header) {
            throw new common_1.UnauthorizedException('Cabecalho JWT ausente');
        }
        return decoded.header;
    }
    async resolvePublicKey(kid) {
        if (!kid) {
            throw new common_1.UnauthorizedException('JWT sem kid');
        }
        const cached = this.publicKeys.get(kid);
        if (cached)
            return cached;
        const response = await fetch(this.config.getOrThrow('OAUTH_JWKS_URL'));
        if (!response.ok) {
            throw new common_1.UnauthorizedException('Falha ao carregar JWKS');
        }
        const body = (await response.json());
        for (const key of body.keys ?? []) {
            if (key.kty !== 'RSA' || !key.kid)
                continue;
            const publicKey = (0, crypto_1.createPublicKey)({
                key: key,
                format: 'jwk',
            }).export({
                format: 'pem',
                type: 'spki',
            });
            this.publicKeys.set(key.kid, publicKey.toString());
        }
        const publicKey = this.publicKeys.get(kid);
        if (!publicKey) {
            throw new common_1.UnauthorizedException('Chave publica do JWT nao encontrada');
        }
        return publicKey;
    }
    validateAudience(claims) {
        const expectedAudience = this.config.get('OAUTH_AUDIENCE');
        if (!expectedAudience)
            return;
        const audiences = Array.isArray(claims.aud)
            ? claims.aud
            : claims.aud
                ? [claims.aud]
                : [];
        if (!audiences.includes(expectedAudience) &&
            claims.azp !== expectedAudience) {
            throw new common_1.UnauthorizedException('Audience invalida');
        }
    }
    toAuthenticatedUser(claims) {
        const roles = this.extractRoles(claims);
        return {
            sub: claims.sub,
            email: claims.email,
            name: claims.name ?? claims.preferred_username ?? claims.email,
            role: roles.includes(auth_types_1.UserRole.ADMIN) ? auth_types_1.UserRole.ADMIN : auth_types_1.UserRole.USER,
        };
    }
    extractRoles(claims) {
        const clientId = this.config.get('OAUTH_CLIENT_ID');
        const roleNames = new Set([
            ...(claims.realm_access?.roles ?? []),
            ...(clientId
                ? (claims.resource_access?.[clientId]?.roles ?? [])
                : []),
        ].map((role) => role.toLowerCase()));
        const roles = [];
        if (roleNames.has('admin'))
            roles.push(auth_types_1.UserRole.ADMIN);
        if (roleNames.has('user') || roles.length === 0)
            roles.push(auth_types_1.UserRole.USER);
        return roles;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map