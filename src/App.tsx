import {useState, useEffect} from 'react';
import highlight from 'highlight.js';
import ts from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/nord.css';
import './App.css';

highlight.registerLanguage('typescript', ts);

const code = `
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {
  return function (...args: Parameters<Fn>): ReturnType<Fn> | void {
      try {
          return fn(...args);
      } catch (err) {
            errHandler?.(err);
      }
  }
}
`;


function App() {
    const [charCount, setCharCount] = useState(10);
    const out = highlight.highlight(code.slice(0, charCount), {language: 'typescript'}).value;


    useEffect(() => {
        const id = setInterval(() => setCharCount(c => c + 1), 10);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="hljs" style={wrapperStyle}>
            <pre style={codeStyle} dangerouslySetInnerHTML={{__html: out}} />
        </div>
    );
}

export default App;

const wrapperStyle = {
    height: "100%"
};

const codeStyle = {
    fontSize: "20px",
    fontFamily: '"Cascadia Code"',
    fontWeight: "bold",
    padding: "20px 40px",
    margin: 0
};

function explodeMarkup(code: string): string {
    return code;
}
