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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const STATE_COOKIE = 'oauth_state';
let AuthController = class AuthController {
    authService;
    config;
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    login(response) {
        const state = (0, crypto_1.randomBytes)(32).toString('hex');
        response.cookie(STATE_COOKIE, state, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.config.get('NODE_ENV') === 'production',
            maxAge: 10 * 60 * 1000,
            path: '/auth/callback',
        });
        return response.redirect(this.authService.getAuthorizationUrl(state));
    }
    async callback(code, state, request, response) {
        if (!code ||
            !this.validState(state, this.readCookie(request, STATE_COOKIE))) {
            throw new common_1.UnauthorizedException('Retorno OAuth2 invalido');
        }
        response.clearCookie(STATE_COOKIE, { path: '/auth/callback' });
        const { accessToken, idToken } = await this.authService.authenticate(code);
        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:5173');
        return response.redirect(`${frontendUrl}/auth/callback` +
            `#access_token=${encodeURIComponent(accessToken)}` +
            `&id_token=${encodeURIComponent(idToken)}`);
    }
    me(request) {
        return request.user;
    }
    logout(idToken, response) {
        const logoutUrl = this.config.getOrThrow("OAUTH_LOGOUT_URL");
        const frontendUrl = this.config.getOrThrow("FRONTEND_URL");
        return response.redirect(`${logoutUrl}?id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${encodeURIComponent(frontendUrl)}`);
    }
    validState(received, expected) {
        if (!received || !expected)
            return false;
        const left = Buffer.from(received);
        const right = Buffer.from(expected);
        return left.length === right.length && (0, crypto_1.timingSafeEqual)(left, right);
    }
    readCookie(request, name) {
        const prefix = `${name}=`;
        return request.headers.cookie
            ?.split(';')
            .map((value) => value.trim())
            .find((value) => value.startsWith(prefix))
            ?.slice(prefix.length);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Query)("id_token")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map