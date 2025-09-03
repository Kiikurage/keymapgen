export interface VSCodeKeybinding {
  key: string;
  command: string;
  when?: string;
}

export type VSCodeKeybindingsFile = VSCodeKeybinding[];