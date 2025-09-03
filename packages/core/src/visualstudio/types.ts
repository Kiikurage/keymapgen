export interface VisualStudioKeybinding {
  command: string;
  scope: string;
  key: string;
}

export interface VisualStudioKeymapFile {
  name: string;
  keybindings: VisualStudioKeybinding[];
}