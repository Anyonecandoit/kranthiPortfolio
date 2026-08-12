import ToolsClientPage from "@/components/tools/tools-client-page";

/**
 * The tools library route. The interactive UI lives in the shared client
 * component ToolsClientPage so it can also be rendered pre-selected on the
 * per-tool SEO landing pages (/tools/[id]).
 */
export default function ToolsPage() {
  return <ToolsClientPage />;
}
