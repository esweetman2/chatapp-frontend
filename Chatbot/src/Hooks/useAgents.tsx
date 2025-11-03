import { useEffect, useState } from "react";


interface Agents {
    agent_name: string | null;
    description: string | null;
    created_date: Date | null;
    model: string | null;
    system_message: string | null;
    id: number | null;
    updated_date: Date | null;
    model_id: number | null;
}

export function useAgents() {
    const [agents, setAgents] = useState<Agents[]>([]);
    const [selectedAgent, setCurrentAgent] = useState<Agents | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let ignore = false;

        async function fetchAgents() {
            try {
                setLoading(true);
                const res = await fetch(`http://127.0.0.1:8000/agent/`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (!ignore) {
                    setAgents(data)
                    // console.log("Fetched Agents:", data[0]);
                    setCurrentAgent(data[0])
                }
            } catch (err) {
                if (!ignore) setError(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchAgents();
        return () => { ignore = true; }; // prevent state updates on unmount
    }, []);

    return { agents, selectedAgent, loading, error };
}