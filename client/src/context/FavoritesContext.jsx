import { createContext, useContext, useMemo, useState } from "react";
import { favoriteGameIds } from "../data/dummyData";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favoriteGames");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return favoriteGameIds;
      }
    }
    return favoriteGameIds;
  });

  const toggleFavorite = (gameId) => {
    setFavorites((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem("favoriteGames", JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (gameId) => favorites.includes(gameId);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
