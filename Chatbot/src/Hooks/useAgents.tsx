import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Agents {
    agent_name: string;
    description: string;
    created_date: Date;
    model: string;
    system_message: string;
    id: number;
    updated_date: Date;
    model_id: number;
}

export function useAgents() {
    const [agents, setAgents] = useState<Agents[]>([]);
    const [selectedAgent, setCurrentAgent] = useState<Agents>({} as Agents);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let ignore = false;

        async function fetchAgents() {
            try {
                // console.log("Running Fetch Agents")
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/agent/`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (!ignore) {
                    setAgents(data)
                    // console.log("Fetched Agents:", data[0]);
                    if(data.length>0) {
                        setCurrentAgent(data[0])
                    } else {
                        setCurrentAgent({} as Agents)
                    }
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
    
    const fetchSingleAgent = async (id: number) => {
        try {
                console.log("Running Fetch Agents")
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/agent?id=${id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                console.log("single agent data: ", data)
                if (data) {
                    // setAgents(data)
                    // console.log("Fetched Agents:", data[0]);
                    setCurrentAgent(data)
                    
                    // if(data.length>0) {
                    // } else {
                    //     setCurrentAgent({} as Agents)
                    // }
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
    }
    return { agents, selectedAgent, loading, error, fetchSingleAgent };
}