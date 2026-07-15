# intranet_frc

## frontend

``VITE_API_URL=/api``

## backend

```DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=terabitsolution

OAUTH_AUTHORIZATION_URL=http://172.16.0.2:8080/realms/terabit/protocol/openid-connect/auth
OAUTH_TOKEN_URL=http://172.16.0.2:8080/realms/terabit/protocol/openid-connect/token
OAUTH_USERINFO_URL=http://172.16.0.2:8080/realms/terabit/protocol/openid-connect/userinfo
OAUTH_JWKS_URL=http://172.16.0.2:8080/realms/terabit/protocol/openid-connect/certs
OAUTH_ISSUER=http://172.16.0.2:8080/realms/terabit

OAUTH_AUDIENCE=terabit-web
OAUTH_CLIENT_ID=terabit-web
OAUTH_CLIENT_SECRET=TXG5W5DcWOcnG1LnMDo7AsJOUIDFyiSM6OnzW2dxJqjPMbMHinsHdc5J1thzS73UaiiUqZMVunYWFQ3Ct4OZsJ

OAUTH_CALLBACK_URL=http://172.16.0.1/auth/callback
OAUTH_SCOPES=openid profile email

OAUTH_LOGOUT_URL=http://172.16.0.2:8080/realms/terabit/protocol/openid-connect/logout

FRONTEND_URL=http://172.16.0.1
PORT=3000```