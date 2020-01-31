module.exports = {
    PORT: process.env.PORT || 8025,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://meganwade@localhost/drip-drop',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  }