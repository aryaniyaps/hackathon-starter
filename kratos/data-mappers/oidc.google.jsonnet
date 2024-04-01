local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
      name: claims.name,
    },
    metadata_public: {
      google_username: claims.preferred_username,
    },
  },
}
