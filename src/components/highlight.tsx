import hightlight from 'highlight.js';
import { PropsWithChildren, useEffect, useRef } from 'react';

import 'highlight.js/styles/monokai-sublime.css';

const CodeHighlight = ({ children }: PropsWithChildren) => {
  const highlightElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightElement.current) {
      const preElement = highlightElement.current.querySelector('pre');
      if (preElement) {
        hightlight.highlightElement(preElement);
      }
    }
  }, []);

  return (
    <div ref={highlightElement} className='highlight-el'>
      {children}
    </div>
  );
};

export default CodeHighlight;
