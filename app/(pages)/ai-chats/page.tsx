import dynamic from "next/dynamic";

// Dynamic Custom Modal imports
const DynamicAIChatComponent = dynamic(
    () => import("@components/AI-Chat/AIChatComponent")
  );

export default function Page() {
  return (
    <DynamicAIChatComponent />
  );
}
    