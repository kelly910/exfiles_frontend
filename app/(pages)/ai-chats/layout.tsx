import WebSocketInitializer from '@services/WebSocketInitializer';

export default function AiChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebSocketInitializer />
      {children}
    </>
  );
}
