module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  pwa: {
    name: "Guest Registration",
    appleMobileWebAppStatusBarStyle: 'white',
    themeColor: "#1976D2",
    msTileColor: "#ffffff",
    manifestOptions: {
      start_url: '/',
      scope: '/'
    },
    workboxOptions: {
      // navigateFallback: '/index.html',
    },
  }
};