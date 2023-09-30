import ReactDOMServer from 'react-dom/server'
import { Request, Response } from 'express'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import Providers from '../public/providers'
import App from '../public/app'
import { fetchISSNow } from '@react-query-pnpm-demo/queries'

type GetHTMLArgs = {
  html: string
  query: unknown
}

const getHTML = ({ html, query }: GetHTMLArgs) => {
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
        <script src="/app.js"></script>
      </body>
    </html>
  `
}

const renderPage = (query: unknown): string => {
  const jsx = (
    <Providers query={query}>
      <App />
    </Providers>
  )

  const html = ReactDOMServer.renderToString(jsx)

  const fullHTML = getHTML({ html, query })

  return fullHTML
}

const prefetchQueries = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(['iss-now'], fetchISSNow)
}

export default async (_req: Request, res: Response) => {
  const queryClient = new QueryClient()

  await prefetchQueries(queryClient)

  const query = dehydrate(queryClient)

  const html = renderPage(query)

  res.set('Content-Type', 'text/html')
  res.write(html)
  res.end()
}
