import { hydrateRoot } from 'react-dom/client'
import { loadableReady } from '@loadable/component'
import { getJSONFromScriptTag } from './utils'
import App from './app'
import Providers from './providers'

loadableReady(() => {
  const MOUNT_POINT = document.getElementById('app') as HTMLElement

  const state = getJSONFromScriptTag('preloaded-state')

  hydrateRoot(
    MOUNT_POINT,
    <Providers {...state}>
      <App />
    </Providers>
  )
})
