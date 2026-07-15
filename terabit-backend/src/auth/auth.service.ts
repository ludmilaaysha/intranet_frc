import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  getAuthorizationUrl(state: string): string {
    const url = new URL(
      this.config.getOrThrow<string>('OAUTH_AUTHORIZATION_URL'),
    );
    url.search = new URLSearchParams({
      client_id: this.config.getOrThrow<string>('OAUTH_CLIENT_ID'),
      redirect_uri: this.config.getOrThrow<string>('OAUTH_CALLBACK_URL'),
      response_type: 'code',
      scope: this.config.get<string>('OAUTH_SCOPES', 'openid profile email'),
      state,
    }).toString();
    return url.toString();
  }

  async authenticate(code: string) {
    return this.exchangeCode(code);
  }

  private async exchangeCode(
    code: string,
  ): Promise<{ accessToken: string; idToken: string }> {
    const response = await fetch(
      this.config.getOrThrow<string>('OAUTH_TOKEN_URL'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.config.getOrThrow<string>('OAUTH_CLIENT_ID'),
          client_secret: this.config.getOrThrow<string>(
            'OAUTH_CLIENT_SECRET',
          ),
          redirect_uri: this.config.getOrThrow<string>(
            'OAUTH_CALLBACK_URL',
          ),
        }),
      },
    );

    if (!response.ok) {
      throw new BadGatewayException(
        'Falha ao trocar o código OAuth2',
      );
    }

    const body = (await response.json()) as {
      access_token?: string;
      id_token?: string;
    };

    if (!body.access_token || !body.id_token) {
      throw new BadGatewayException(
        'Tokens ausentes na resposta OAuth2',
      );
    }

    return {
      accessToken: body.access_token,
      idToken: body.id_token,
    };
  }
}
