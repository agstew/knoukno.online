import { useEffect, useState } from "react";
import { api } from "./api.js";
import { useAuth } from "./AuthContext.jsx";

const STORAGE_KEY = "knoukno_selected_title";

// Shared across the Questions/Grade/Rate/Average pages: lets a user with
// multiple business titles switch between them, remembering the last pick.
export function useSelectedTitle() {
  const { token } = useAuth();
  const [titles, setTitles] = useState([]);
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .listTitles(token)
      .then((data) => {
        setTitles(data.titles);
        setSelectedId((prev) => {
          if (prev && data.titles.some((t) => t._id === prev)) return prev;
          return data.titles[0]?._id || "";
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  function selectTitle(id) {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  const selectedTitle = titles.find((t) => t._id === selectedId) || null;

  return { titles, selectedId, selectTitle, selectedTitle, loading, error };
}
