// 已屏蔽sonor
const env = document.domain.indexOf('sit') > -1 || document.domain === 'localhost' ? 'test' : 'online'

var tag,
  fioUrl = 'common-sit1.fcbox.com/cdn/staticResource/commonUtil/fio/fio_v2.1.js'
if (!/-sit/.test(location.host) && /fcbox/.test(location.host)) {
  fioUrl = 'common.fcbox.com/cdn/staticResource/commonUtil/fio/fio_v2.1.js'
}
// eslint-disable-next-line no-unused-expressions
!(function (e, t, n, g, i) {
  ;(e[i] =
    e[i] ||
    function () {
      ;(e[i].q = e[i].q || []).push(arguments)
    }),
    (n = t.createElement('script')),
    (tag = t.getElementsByTagName('script')[0]),
    (n.async = 1),
    (n.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + g),
    tag.parentNode.insertBefore(n, tag)
})(window, document, 'script', fioUrl, 'fio')
window.fio('init', {
  fc_project: 'net-admin-frontend', // 项目参数必须唯一
  fc_version: '1.1.0', // 与上线tag号保持一致
  topic: 'expressFrontEndLog', // 埋点前跟产品确认
  single_page: true,
  env
})
