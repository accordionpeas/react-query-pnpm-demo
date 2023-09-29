import axios from 'axios'

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

export const fetchISSNow = async () => {
  const response = await axios('http://api.open-notify.org/iss-now.json')
  return response.data
}
