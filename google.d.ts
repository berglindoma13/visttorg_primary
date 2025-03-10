// types/google.d.ts
export {};

declare global {
  namespace google.accounts.id {
    interface CredentialResponse {
      clientId: string;
      credential: string;
      select_by: string;
    }

    interface IdConfiguration {
      client_id: string;
      callback: (response: CredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      prompt_parent_id?: string;
    }

    function initialize(config: IdConfiguration): void;
    function renderButton(
      parent: HTMLElement,
      options: { theme: string; size: string }
    ): void;
    function prompt(): void;
  }
}