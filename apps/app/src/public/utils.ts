export const isServer = typeof window === 'undefined'

export const getJSONFromScriptTag = (id: string) => {
  try {
    const script = document.querySelector(`#${id}`)
    const textContent = script ? script.textContent || '' : ''
    return script ? JSON.parse(textContent) : {}
  } catch (err) {
    return {}
  }
}
