import { useEffect, useState } from "react";
type Topic = { slug: string; title: string; level: string };
type Exercise = { id: string; topic: string; title: string; prompt: string; expectedOutput: string; tests: string[] };
export function LearningCentre({ apiUrl }: { apiUrl: string }) {
  const [topics, setTopics] = useState<Topic[]>([]); const [exercises, setExercises] = useState<Exercise[]>([]); const [error, setError] = useState<string>();
  useEffect(() => { Promise.all([fetch(`${apiUrl}/api/v1/learning/topics`), fetch(`${apiUrl}/api/v1/learning/exercises`)]).then(async ([a,b]) => { if (!a.ok || !b.ok) throw new Error("Learning service is unavailable"); setTopics((await a.json()).topics); setExercises((await b.json()).exercises); }).catch(reason => setError(reason.message)); }, [apiUrl]);
  return <section className="learning"><p className="eyebrow">LEARNING CENTRE</p><h2>Build Swift skills through practice.</h2><p>Curriculum and exercises are available now; personal progress appears only after submissions are stored.</p>{error ? <p>{error}</p> : <><div className="topic-grid">{topics.map(topic => <article key={topic.slug}><small>{topic.level}</small><h3>{topic.title}</h3></article>)}</div><div className="exercise-list">{exercises.map(exercise => <article key={exercise.id}><p className="eyebrow">{exercise.topic}</p><h3>{exercise.title}</h3><p>{exercise.prompt}</p><details><summary>Expected output & checks</summary><code>{exercise.expectedOutput}</code><ul>{exercise.tests.map(test => <li key={test}>{test}</li>)}</ul></details></article>)}</div></>}</section>;
}
