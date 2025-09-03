export interface IntelliJKeybinding {
  actionId: string;
  keystrokes: string[];
}

export interface IntelliJKeymapFile {
  name: string;
  parent?: string;
  keybindings: IntelliJKeybinding[];
}