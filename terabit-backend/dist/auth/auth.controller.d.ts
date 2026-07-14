import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    login(response: Response): void;
    callback(code: string, state: string, request: Request, response: Response): Promise<void>;
    me(request: AuthenticatedRequest): import("./auth.types").AuthenticatedUser;
    private validState;
    private readCookie;
}
