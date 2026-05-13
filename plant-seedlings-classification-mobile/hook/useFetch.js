import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";

/**
 * @param {string} endpoint  - API endpoint (e.g. "getAllImages")
 * @param {object} query     - Query params object
 * @param {string} dataKey   - Key to extract from response (default: null = whole response)
 * @param {Array}  deps      - Extra dependency array to trigger re-fetch
 */
const useFetch = (endpoint, query = {}, dataKey = null, deps = []) => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (overrideQuery = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        params: { ...query, ...overrideQuery },
      });

      const responseData = response.data;

      if (dataKey) {
        setData(responseData[dataKey] ?? []);
      } else {
        setData(responseData);
      }

      // Store pagination meta if present
      if (responseData.total !== undefined) {
        setMeta({
          total: responseData.total,
          page: responseData.page,
          per_page: responseData.per_page,
          total_pages: responseData.total_pages,
        });
      }
    } catch (err) {
      setError(err);
      console.log("useFetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, JSON.stringify(query)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  const refetch = (overrideQuery = {}) => {
    fetchData(overrideQuery);
  };

  return { data, meta, isLoading, error, refetch };
};

export default useFetch;
