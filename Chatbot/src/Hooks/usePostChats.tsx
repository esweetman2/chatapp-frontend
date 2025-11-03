// import { useEffect, useState } from "react";


// interface Chat {
//     user_id: number;
//     agent_id: number;
//     title: string;
// }

// export function usePostChat() {
//     const [chat, setChat] = useState<Chat>();
//     // const [selectedAgent, setCurrentAgent] = useState<Chat | null>(null);

//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<any>(null);

//     // useEffect(() => {
//     let ignore = false;

    // async function postChat(chatData: Chat) {
    //     try {
    //         setLoading(true);
    //         const res = await fetch(`http://127.0.0.1:8000/agent/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 user_id: chatData.user_id,
    //                 agent_id: chatData.agent_id,
    //                 title: chatData.title
    //             })
    //         });

    //         if (!res.ok) throw new Error("Failed to fetch");
    //         const data = await res.json();
    //         if (!ignore) {
    //             setChat(data)
    //             console.log("Fetched Agents:", data[0]);

    //         }
    //     } catch (err) {
    //         if (!ignore) setError(err);
    //     } finally {
    //         if (!ignore) setLoading(false);
    //     }
    // }

//     // return () => { ignore = true; }; // prevent state updates on unmount
//     // }, []);

//     return { postChat };
// }