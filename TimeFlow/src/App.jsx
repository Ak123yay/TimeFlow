import { useState } from "react";
import Setup from "./components/Setup";
import Today from "./components/Today";
import "./App.css";

export default function App() {
  const [setupDone, setSetupDone] = useState(false);

  return (
    <div className="App">
      {!setupDone ? (
        <Setup onDone={() => setSetupDone(true)} />
      ) : (
        <Today />
      )}
    </div>
  );
}
