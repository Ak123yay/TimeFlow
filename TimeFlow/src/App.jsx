import { useState } from "react";
import Setup from "./components/Setup";
import Today from "./components/Today";
import { loadAvailability } from "./utils/storage";
import "./App.css";

export default function App() {
  const [setupDone, setSetupDone] = useState(() => {
    const availability = loadAvailability();
    return !!(availability && availability.start && availability.end);
  });

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
