import { useEffect, useState } from "react";
import { Pet, type PetState } from "./pet/Pet";
import { usePetState } from "./pet/usePetState";
import { LearningCentre } from "./learning/LearningCentre";

type Health = { status: string; service: string };
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(() => localStorage.getItem("codepet.name") || "Byte");
  const [sound, setSound] = useState(() => localStorage.getItem("codepet.sound") !== "false");
  const [voice, setVoice] = useState(() => localStorage.getItem("codepet.voice") === "true");
  const pet = usePetState();

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/health`)
      .then(async (response) => {
        if (!response.ok) throw new Error("API is unavailable");
        return response.json() as Promise<Health>;
      })
      .then((result) => {
        setHealth(result);
        pet.transition("coding");
      })
      .catch((reason: Error) => {
        setError(reason.message);
        pet.transition("confused");
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("codepet.name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("codepet.sound", String(sound));
  }, [sound]);

  useEffect(() => {
    localStorage.setItem("codepet.voice", String(voice));
  }, [voice]);

  return (
    <main>
      <section className="shell">
        <p className="eyebrow">CODEPET AI · PET COMPANION</p>
        <h1>Your coding companion is here.</h1>
        <p>Its state responds to real app events and only offers actions supported by the current phase.</p>
        <Pet state={pet.state} name={name} />
        <div className="controls">
          <label>
            Name
            <input
              value={name}
              maxLength={24}
              onChange={(event) => setName(event.target.value || "Byte")}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={sound}
              onChange={(event) => setSound(event.target.checked)}
            />{" "}
            Sounds
          </label>
          <label>
            <input
              type="checkbox"
              checked={voice}
              onChange={(event) => setVoice(event.target.checked)}
            />{" "}
            Voice (prepared)
          </label>
        </div>
        <p className="settings-note">
          Preferences are saved locally until you sign in. Voice synthesis is intentionally disabled until an accessibility-reviewed voice provider is configured.
        </p>
        <div className="states" aria-label="Pet state controls">
          {pet.allowed.map((next: PetState) => (
            <button key={next} onClick={() => pet.transition(next)}>
              {next}
            </button>
          ))}
        </div>
        <div className={`status ${error ? "offline" : ""}`}>
          <span />
          {error ?? (health ? `${health.service} is ${health.status}` : "Connecting to API…")}
        </div>
        <LearningCentre apiUrl={apiUrl} />
      </section>
    </main>
  );
}
