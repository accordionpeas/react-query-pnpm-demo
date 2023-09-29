import axios from 'axios'
import { useQuery } from "@tanstack/react-query"

export const fetchISSNow = async () => {
  const response = await axios('http://api.open-notify.org/iss-now.json')
  return response.data
}

export const useISSNowQuery = () => useQuery(['iss-now'], fetchISSNow)
