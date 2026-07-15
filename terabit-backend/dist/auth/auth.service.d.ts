import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly config;
    constructor(config: ConfigService);
    getAuthorizationUrl(state: string): string;
    authenticate(code: string): Promise<{
        accessToken: string;
        idToken: string;
    }>;
    private exchangeCode;
}
