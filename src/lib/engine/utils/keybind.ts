import hotkeys from "hotkeys-js";

const HTMLKeyBindAttribute = "data-keybind";
const Keys = [..."1234567890abcdefghijklmnopqrstuvwxyz"].join(",");

export function bindKeys() {
  hotkeys(Keys, function (event, handler) {
    const elements = document.querySelectorAll<HTMLElement>(
      `[${HTMLKeyBindAttribute}]`,
    );
    for (const element of elements) {
      const keybind = element.getAttribute(HTMLKeyBindAttribute);
      if (keybind === handler.key) {
        element.click();
        return false;
      }
    }
  });
}

export function unBindKeys() {
  hotkeys.unbind();
}
