let { permissionCodes = [] } = JSON.parse(localStorage.getItem('userInfo') || '{}')

export const setAuth = (arr: Array<string>) => {
  permissionCodes = arr
}

export const removeAuth = () => {
  permissionCodes = []
}

export const hasAuth = (code: string) => {
  return permissionCodes.includes(code)
}

export default {
  beforeMount(el: any, binding: any) {
    if (!permissionCodes.includes(binding.value)) {
      el.style.display = 'none'
    }
  }
}
