import { useQuery } from "@tanstack/react-query"
import { fetchISSNow } from "./utils"

const App = () => {
  const { data } = useQuery(['iss-now'], fetchISSNow)

  return (
    <>
      <p>ISS NOW</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
