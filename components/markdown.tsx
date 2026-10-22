import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// For product descriptions stored in the database. Raw HTML is not rendered.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
