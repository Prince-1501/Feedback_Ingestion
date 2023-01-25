/*

1. Push and Pull Integration Model
2. Metadata Ingestion: each source can have different types of metadata values, e.g app-version from Playstore, Country from Twitter, etc.
3. Multi-tenancy - Implemented
4. Transformation to a uniform internal structure
    1. Support different type of feedback data e.g Reviews, Conversations etc
    2. Support source-specific metadata - Implemented
    3. Have common record-level attributes like record language, tenant info, source info, etc
5. Idempotency: Ability to de-dupe ingested feedbacks
6. Supporting multiple feedback sources of the same type for a tenant, e.g feedback from two different Playstore Apps for the same tenant

*/