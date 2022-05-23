export const rules = {
  iconfontResource: /^(https?:)?\/\/at\.alicdn\.com\/t\/.+\.(cs|j)s$/i
}

export function isIconfontResource (url: string) {
  return rules.iconfontResource.test(url)
}
