import path from 'path'
import { ChunkExtractor } from '@loadable/server'
import ReactDOMServer from 'react-dom/server'
import { Request, Response } from 'express'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import Providers from '../public/providers'
import App from '../public/app'
import { fetchISSNow } from '..//public/utils'

const statsFile = path.resolve(process.cwd(), 'build/public/loadable-stats.json')

type GetHTMLArgs = {
  html: string
  scriptTags: string
  query: unknown
}

const getHTML = ({ html, scriptTags, query }: GetHTMLArgs) => {
  const stringifiedState = JSON.stringify({ query }, null, 2)

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="app">${html}</div>
        <script id="preloaded-state" type="application/json">
          ${stringifiedState.replace(/</g, '\\u003c')}
        </script>
        ${scriptTags}
      </body>
    </html>
  `
}

type RenderPageArgs = {
  query: unknown
}

const renderPage = ({ query }: RenderPageArgs): string => {
  const extractor = new ChunkExtractor({
    entrypoints: ['app'],
    statsFile,
  })

  const jsx = extractor.collectChunks(
    <Providers query={query}>
      <App />
    </Providers>
  )

  const html = ReactDOMServer.renderToString(jsx)
  const scriptTags = extractor.getScriptTags()

  const fullHTML = getHTML({ html, scriptTags, query })

  return fullHTML
}

const prefetchQueries = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(['iss-now'], fetchISSNow)
}

export default async (_req: Request, res: Response) => {
  const queryClient = new QueryClient()

  await prefetchQueries(queryClient)

  const query = dehydrate(queryClient)

  const html = renderPage({ query })

  res.set('Content-Type', 'text/html')
  res.write(html)
  res.end()
}
