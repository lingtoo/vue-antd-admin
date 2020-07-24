const getters = {
  isMobile: state => state.setting.isMobile,
  lang: state => state.setting.lang,
  theme: state => state.setting.theme,
  color: state => state.setting.theme.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  //multiTab: state => state.app.multiTab
}

export default getters
