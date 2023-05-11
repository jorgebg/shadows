import { writable } from 'svelte/store';

export enum View {
    Menu, Game
}
export const currentView = writable(View.Menu);

