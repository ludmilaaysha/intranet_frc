import { Request } from 'express';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export interface AuthenticatedUser {
    sub: string;
    email?: string;
    name?: string;
    role: UserRole;
}
export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}
export interface OidcTokenClaims {
    sub: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    aud?: string | string[];
    azp?: string;
    realm_access?: {
        roles?: string[];
    };
    resource_access?: Record<string, {
        roles?: string[];
    }>;
}
export interface OidcUserInfo {
    sub: string;
    email: string;
    name?: string;
    preferred_username?: string;
}
