import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Chats {
    id: number
    user_id: number
    agent_id: number
    title: string
    created_date: Date
    summary: string
    message_start_index: number
    messages: Array<Messages>
}

interface Messages {
    chat_id: number
    id: number
    role: string
    user_id: number
    agent_id: number
    message: string
    created_date: Date
}

export function useChats(userId: number, agent_id: number) {
    const [chats, setChats] = useState<Chats[]>([]);
    // const [selectedAgent, setCurrentAgent] = useState<Chats>({} as Chats);
    const [messages, setMessages] = useState<Array<Messages>>([]);

    const [chatsLoading, setChatsLoading] = useState<boolean>(true);
    const [chatsError, setChatsError] = useState<any>(null);

    useEffect(() => {
        let ignore = false;

        async function fetchChats() {
            try {
                if (!userId || !agent_id) return;
                // console.log("Running Fetch Agents")
                setChatsLoading(true);
                // const userId = 2
                // const agent_id = 2
                const res = await fetch(`${API_BASE_URL}/chats/?user_id=${userId}&agent_id=${agent_id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (!ignore) {
                    if(data.length === 0){
                        setChats([])
                        setMessages([])
                    } else {

                        setChats(data)
                        console.log("data: ", data)
                        setMessages(data["messages"])
                    }
                    // console.log("Fetched Agents:", data[0]);
                    // if(data.length>0) {
                    //     setCurrentAgent(data[1])
                    // } else {
                    //     setCurrentAgent({} as Agents)
                    // }
                }
            } catch (err) {
                if (!ignore) setChatsError(err);
            } finally {
                if (!ignore) setChatsLoading(false);
            }
        }


        fetchChats();
        return () => { ignore = true; }; // prevent state updates on unmount
    }, []);

    return { chats, messages, chatsLoading, chatsError };
}