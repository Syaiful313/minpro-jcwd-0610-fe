import type { FC } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "./../../node_modules/rehype-raw/lib/index";

interface MarkDownProps {
  content: string;
}

const Markdown: FC<MarkDownProps> = ({ content }) => {
  const renderes: Components = {
    h1: ({ children }) => <h1 className="text-2xl font-extrabold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-md font-medium">{children}</h4>,
    p: ({ children }) => <p className="text-base font-light">{children}</p>,
    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
  };

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={renderes}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;



