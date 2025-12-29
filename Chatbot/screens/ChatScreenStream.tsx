import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useOutletContext } from 'react-router';
import { useUserContext } from '../src/Context/UserContext';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import ChatWindow from '../components/ChatWindow'

// import Layout from '../components/Layout'
// import SideBar from '../components/SideBar'
import SendIcon from '@mui/icons-material/Send';
import '../src/App.css'
import {
    IconButton,
    // Paper,
    TextField,
    // Typography,
    CircularProgress
} from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Message {
    agent_id: number;
    chat_id: number;
    created_date?: Date;
    id?: number;
    role: string;
    message: string;
}

interface Chat {
    id: number;
    user_id: number;
    agent_id: number;
    title: string;
    creaded_date: Date;
    messages: Message[];
}

function ChatScreenStream() {

    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { selectedAgent, childCurrentChat, setCurrentChatId, appendMessages, appendToLastAssistantMessage, addNewChat } = useOutletContext<any>();
    const { user } = useUserContext();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [childCurrentChat?.messages]);


    const messageInterface = (
        agent_id: number,
        chat_id: number,
        role: string,
        message: string
    ) => {

        const new_message: Message = {
            agent_id: agent_id,
            chat_id: chat_id,
            created_date: new Date(),
            id: 0,
            role: role,
            message: message,
        }
        return new_message
    }

    const newChat = async (input: string) => {
        const chat = {
            user_id: user?.id,
            agent_id: selectedAgent ? selectedAgent.id : 0,
            title: input.trim().slice(0, 50) || "New Chat"
        }

        const res = await fetch(`${API_BASE_URL}/chats/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(chat),
        })
        if (!res.ok) { throw new Error("Failed to create new chat") };
        const data = await res.json();
        return data;
    }

    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                if (input.trim() !== '' && event.key === 'Enter') {
                    event.preventDefault();

                    await handleChat(selectedAgent.id, input.trim(), "user");

                }
                // Prevent default form submission if Enter is pressed without Shift
                // // You can add your submission logic here if needed
                // console.log('Enter pressed without Shift. Value:', event.target.value);
            }
            // If Shift + Enter, allow default behavior (new line)
        }
    };


    const postMessageStream = async (message: string, role: string, chat: Chat) => {
        try {
            await appendMessages(chat.id, messageInterface(
                chat.agent_id,
                chat?.id,
                "assistant",
                ""
            ))
            // console.log("Current Chat: ", curChat.current)
            const llmCallRes = await fetch(`${API_BASE_URL}/messages/agent/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    agent_id: chat.agent_id,
                    chat_id: chat.id,
                    message: message,
                    role: role,
                    user_id: user?.id,
                }),
            })

            if (!llmCallRes.body) return

            const reader = llmCallRes.body?.getReader()
            const decoder = new TextDecoder("utf-8")
            let done = false;


            while (!done) {
                const { value, done: readerDone } = await reader?.read()

                done = readerDone

                if (value) {
                    const chunkValue = decoder.decode(value, { stream: true })

                    await appendToLastAssistantMessage(chat.id, chunkValue)
                }
            }

        } catch (err) {
            console.error("Error posting chat message:", err);
        }
    }


    const handleChat = async (selectedAgent: any, input: string, role: string) => {
        // console.log("RUNNIGN HANDLE CHAT")
        setLoading(true);

        if (!input.trim()) return
        setInput("")
        let cur_chat = childCurrentChat
        if (childCurrentChat === null) {
            // console.log("Creating new chat")
            cur_chat = await newChat(input.trim());
            cur_chat.messages = []
            // console.log("NewChat: ",cur_chat)
            addNewChat(cur_chat)
            setCurrentChatId(cur_chat.id);
            /// I think we ned to append chat.

            await appendMessages(cur_chat.id, messageInterface(
                selectedAgent,
                cur_chat?.id,
                role,
                input.trim(),
            ))
        } else if (childCurrentChat !== null) {

            await appendMessages(cur_chat.id, messageInterface(
                selectedAgent,
                cur_chat?.id,
                role,
                input.trim(),
            ))
        }


        await postMessageStream(input.trim(), role, cur_chat)
        setLoading(false)
    }



    return (
        // <Box sx={{ flexGrow: 1, p: 3, boxShadow: 3, borderRadius: 3, overflowY: 'hidden', height: '100vh', backgroundColor: "gray" }}>
        <Box sx={{ height: "100%", width: '100%' }}>
            {/* <SideBar conversations={conversations} /> */}

            <Box component="main" sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                p: 3,
                borderRadius: 3,
                // overflowY: 'auto',
                backgroundColor: "#fafafa",
                // backgroundColor: "blue",

                height: "100%",
                width: '100%',
                // position: "relative"
            }}>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2,
                    // maxHeight: '100%',
                    // minHeight: '60vh',
                    // overflowY: 'auto',
                    padding: 2,
                    // backgroundColor: "yellow"
                }}
                    ref={scrollRef}
                >

                    {
                        childCurrentChat
                            ?
                            <ChatWindow childCurrentChat={childCurrentChat} />
                            :
                            <p>Start typing</p>

                    }
                </Box>
                <Box sx={{
                    display: 'flex',
                    position: "fixed",
                    bottom: 0,
                    width: "inherit",
                    // m: 4,
                    // p:4,
                    // alignItems: 'flex-end',
                    // position: "relative",
                    backgroundColor: "#fafafa"
                }}>
                    <Box sx={{
                        display: 'flex',
                        // position: "fixed",
                        // bottom: 0,
                        width: "50%",
                        ml: 4,
                        mr: 4,
                        mb: 4,

                        // alignItems: 'flex-end',
                        // position: "relative",
                        // backgroundColor: "white"
                    }}>

                        <TextField
                            multiline={true}
                            fullWidth
                            variant="outlined"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            // onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            onKeyDown={handleKeyDown}
                        />
                        <IconButton

                            color="primary" onClick={() => handleChat(selectedAgent.id, input, "user")} sx={{ ml: 1 }} disabled={input.trim() == "" || input.trim() === ''}>
                            {
                                loading
                                    ?
                                    <CircularProgress size={24} />
                                    :
                                    <SendIcon />
                            }
                        </IconButton>
                    </Box>


                </Box>
            </Box>
        </Box>


    )
}

export default ChatScreenStream;
