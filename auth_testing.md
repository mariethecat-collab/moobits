# Moobits Auth Testing Playbook

## Admin Credentials (env-seeded)
- Email: `admin@moobits.id`
- Password: `moobits2026`
- Role: `admin`

Override via `/app/backend/.env`: `ADMIN_EMAIL=...`, `ADMIN_PASSWORD=...`

## MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Verify bcrypt hash starts with `$2b$`. Indexes:
- users.email unique
- login_attempts.identifier
- password_reset_tokens.expires_at TTL

## API Smoke
```
curl -c c.txt -X POST $BACKEND/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@moobits.id","password":"moobits2026"}'
curl -b c.txt $BACKEND/api/auth/me
```

## Endpoints
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- POST /api/auth/refresh
