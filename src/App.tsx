import "./App.css";
import { CodeContainer } from "./CodeContainer";

const CODE = `
function App() {
  return (
    <div className="main">
      <CodeContainer code={CODE} stages={stages} />;
    </div>
  );
}
`;

const stages = [
  [0, 6],
  [0, 1, 5, 6],
  [0, 1, 2, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
];

function App() {
  return (
    <div className="main">
      <CodeContainer code={CODE} stages={stages} />;
    </div>
  );
}

export default App;
