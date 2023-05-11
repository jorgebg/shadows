const savedGameStorageKey = "savedGame";

export function loadGame() {
    const serialized = localStorage.getItem(savedGameStorageKey);
    let state = null;
    try {
        state = JSON.parse(serialized);
    } catch {
        console.log("Corrupted save")
    }
    return state;
}

export function saveGame(state) {
    const serialized = JSON.stringify(state);
    localStorage.setItem(savedGameStorageKey, serialized);

}

export function deleteGame() {
    localStorage.removeItem(savedGameStorageKey)
}