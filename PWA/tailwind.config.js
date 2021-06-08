module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './**/*.html',
      './js/**/*.js'
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
