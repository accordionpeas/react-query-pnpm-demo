import { useISSNowQuery } from '@react-query-pnpm-demo/queries'

const App = () => {
  const { data } = useISSNowQuery()

  return (
    <>
      <p>ISS NOW</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
