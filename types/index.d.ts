import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;

export interface CommandOption {
  type: number;
  name: string;
  description: string;
  required?: boolean;
}

export interface Command {
  name: string;
  description: string;
  options?: CommandOption[];
  integration_types?: number[];
  contexts?: number[];
  execute: (
    interaction: DiscordInteraction,
    env: Env,
  ) => DiscordInteractionResponse | Promise<DiscordInteractionResponse>;
}

export interface DiscordInteractionResponse {
  type: number;
  data?: Record<string, unknown>;
}

export interface StatusResult {
  status: number;
  hostname: string;
  duration: number;
  success: boolean;
  timestamp: string;
}

export interface StatusEntry {
  name: string;
  group: string;
  results: StatusResult[];
}

export interface DiscordInteractionOption {
  name: string;
  type: number;
  value: string;
}

export interface DiscordInteractionUser {
  id?: string;
  username?: string;
}

export interface DiscordInteraction {
  id?: string;
  token: string;
  type: number;
  data?: {
    id?: string;
    name: string;
    options?: DiscordInteractionOption[];
    custom_id?: string;
    component_type?: number;
  };
  member?: { user?: DiscordInteractionUser };
  user?: DiscordInteractionUser;
}

export interface MarkdownSection {
  heading: string;
  body: string;
}

export interface HTMLPage {
  title: string;
  filename: string;
  styles: string;
  content: string;
}
