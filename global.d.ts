export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: 'event' | 'config' | 'js',
      action: string,
      params?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        page_path?: string;
        [key: string]: any;
      }
    ) => void;
  }
}
