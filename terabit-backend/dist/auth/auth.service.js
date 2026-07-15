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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    config;
    constructor(config) {
        this.config = config;
    }
    getAuthorizationUrl(state) {
        const url = new URL(this.config.getOrThrow('OAUTH_AUTHORIZATION_URL'));
        url.search = new URLSearchParams({
            client_id: this.config.getOrThrow('OAUTH_CLIENT_ID'),
            redirect_uri: this.config.getOrThrow('OAUTH_CALLBACK_URL'),
            response_type: 'code',
            scope: this.config.get('OAUTH_SCOPES', 'openid profile email'),
            state,
        }).toString();
        return url.toString();
    }
    async authenticate(code) {
        return this.exchangeCode(code);
    }
    async exchangeCode(code) {
        const response = await fetch(this.config.getOrThrow('OAUTH_TOKEN_URL'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: this.config.getOrThrow('OAUTH_CLIENT_ID'),
                client_secret: this.config.getOrThrow('OAUTH_CLIENT_SECRET'),
                redirect_uri: this.config.getOrThrow('OAUTH_CALLBACK_URL'),
            }),
        });
        if (!response.ok) {
            throw new common_1.BadGatewayException('Falha ao trocar o código OAuth2');
        }
        const body = (await response.json());
        if (!body.access_token || !body.id_token) {
            throw new common_1.BadGatewayException('Tokens ausentes na resposta OAuth2');
        }
        return {
            accessToken: body.access_token,
            idToken: body.id_token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map