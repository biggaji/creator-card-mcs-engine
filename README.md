# Creator Card Microservice

Implementation of the Creator Card API assessment, built on the provided Node.js backend template. See `documentation.md` for the template's architecture conventions.

## Setup

```bash
git clone https://github.com/biggaji/creator-card-mcs-engine.git
npm install
```

Create a `.env` file:

```dotenv
# SERVER
PORT=8000
APP_BASE_URL=http://localhost:8000
APP_NAME="Creator cards"

# DB
MONGODB_URI=<your-mongodb-connection-string>
```

Run:

```bash
node bootstrap.js
```

## Implementation Notes

**Soft delete.** Cards use `paranoid: true` rather than hard deletion. On delete, `deleted` is set to a timestamp and the document's `slug` is internally prefixed/mangled so the original slug becomes available for reuse by a future card, while the deleted record itself remains in the database for audit/history purposes.

**Random suffix generation.** The 6-character alphanumeric suffix appended to short or colliding auto-generated slugs uses the template's `@app-core/randomness` `randomBytes`, not Node's `crypto.randomBytes` (which returns a raw byte buffer, not an alphanumeric string).
