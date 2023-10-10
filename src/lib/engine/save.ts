import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();

const savedGameStorageKey = "savedGame";

export function loadMatch(): string {
  const matchID = localStorage.getItem(savedGameStorageKey);
  return matchID;
}

export function newMatch(): string {
  const matchID = uid.rnd();
  localStorage.setItem(savedGameStorageKey, matchID);
  return matchID;
}

export function deleteMatch() {
  localStorage.removeItem(savedGameStorageKey);
}
