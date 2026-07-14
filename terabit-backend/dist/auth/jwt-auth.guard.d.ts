import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly config;
    private readonly publicKeys;
    constructor(jwtService: JwtService, config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private readHeader;
    private resolvePublicKey;
    private validateAudience;
    private toAuthenticatedUser;
    private extractRoles;
}
