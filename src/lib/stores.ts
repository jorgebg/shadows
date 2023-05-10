import { writable } from 'svelte/store';

export enum View {
    Menu, Game
}
export const currentView = writable(View.Menu);

const savedGameStorageKey = "savedGame";
let savedGameState = null;
try {
    savedGameState = JSON.parse(localStorage.getItem(savedGameStorageKey));
} catch {
    console.log("Corrupted save")
}

export const savedGame = writable(savedGameState);
savedGame.subscribe(value => {
    localStorage.setItem(JSON.stringify(savedGameStorageKey), value);
});
