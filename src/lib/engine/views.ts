import { writable } from "svelte/store";

export enum View {
  MainMenu = "MainMenu",
  Play = "Play",
}
export const activeView = writable<View>(View.MainMenu);
