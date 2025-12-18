import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useOutletContext } from 'react-router';
import { useUserContext } from '../src/Context/UserContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// import Layout from '../components/Layout'
// import SideBar from '../components/SideBar'
import SendIcon from '@mui/icons-material/Send';
import '../src/App.css'
import {
    IconButton,
    // Paper,
    TextField,
    Typography,
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

function ChatScreen() {

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { selectedAgent, chatMessages, currentChat, getChats, setCurrentChat } = useOutletContext<any>();
    const { user } = useUserContext();
    const [loading, setLoading] = useState<boolean>(false);
    // const curChat = useRef(currentChat)

    useEffect(() => {
        if (scrollRef.current) {
            // scrollRef.current.scrollIntoView({ behavior: "smooth" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    useEffect(() => {
        setMessages(chatMessages);
    }, [currentChat]);


    useEffect(() => {
        setMessages(chatMessages);
    }, [selectedAgent]);

    const newChat = async (input: string) => {
        const chat = {
            user_id: user?.id,
            agent_id: selectedAgent ? selectedAgent.id : 0,
            title: input.trim().slice(0, 50) || "New Chat"
        }
        // console.log("Creating New Chat:", chat)

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
        // console.log("New Chat Created:", data)
        return data;
    }

    // const getMessages = async(chatId: number) => {

    //     const res = await fetch(`http://127.0.0.1:8000/messages/?chat_id=${chatId}`)
    //     if (!res.ok) {throw new Error("Failed to create new chat")};
    //     const data = await res.json();
    //     console.log("New Chat Created:", data)
    //     setMessages(data["messages"])

    // }



    const handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                if (input.trim() !== '' && event.key === 'Enter') {
                    event.preventDefault();

                    await handleChat(selectedAgent.id, input.trim(), "user");
                    // if (messages.length === 0 && Object.keys(currentChat).length === 0) {
                    //     // console.log("Starting new chat flow");
                    //     const newestChat = await newChat(input.trim());
                    //     // console.log("Newest Chat from API:", newestChat);
                    //     await getChats(user?.id)
                    //     // await getMessages(curChat.current.id)
                    //     curChat.current = newestChat
                    //     await setCurrentChat(newestChat)
                    //     // await handleChat(selectedAgent.id, input.trim(), "user");

                    // } else {
                    //     await handleChat(selectedAgent.id, input.trim(), "user");
                    // }
                }
                // Prevent default form submission if Enter is pressed without Shift
                // // You can add your submission logic here if needed
                // console.log('Enter pressed without Shift. Value:', event.target.value);
            }
            // If Shift + Enter, allow default behavior (new line)
        }
    };

    const postMessage = async (message: string, role: string, chat: Chat) => {
        // console.log(message, curChat, role)
        // console.log("cur chat:", curChat)
        try {
            // console.log("Current Chat: ", curChat.current)
            const llmCallRes = await fetch(`${API_BASE_URL}/messages/agent/`, {
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
            if (!llmCallRes.ok) throw new Error("Failed to get LLM response");
            const llmData = await llmCallRes.json();
            // console.log("LLM Response:", llmData);
            setMessages(prevMessages => [...prevMessages, { message: llmData.message, role: llmData.role, agent_id: chat.agent_id, chat_id: chat.id }]);
        } catch (err) {
            console.error("Error posting chat message:", err);
        }
    }

    const handleChat = async (selectedAgent: any, input: string, role: string) => {
        // console.log("RUNNIGN HANDLE CHAT")

        if (messages.length === 0 && currentChat === null) {
            setLoading(true);
            setMessages( prev => [...prev, { message: input.trim(), role: role, agent_id: selectedAgent.id, chat_id: currentChat?.id}]);
            setInput("")
    
            const newestChat = await newChat(input.trim());

            // API CALL TO STORE CHAT MESSAGE
            await postMessage(input.trim(), role, newestChat)
            await getChats(user?.id)
            setCurrentChat(newestChat);
            setLoading(false)

        } else {

            setLoading(true);
            setMessages([...messages, { message: input.trim(), role: role, agent_id: selectedAgent.id, chat_id: currentChat.id }]);
            setInput("")
            // API CALL TO STORE CHAT MESSAGE
            await postMessage(input.trim(), role, currentChat)
            // console.log("Post Chat Response:", postMessageData);
            setLoading(false)
        }
    }



    return (
        // <Box sx={{ flexGrow: 1, p: 3, boxShadow: 3, borderRadius: 3, overflowY: 'hidden', height: '100vh', backgroundColor: "gray" }}>
        <Box sx={{ width: '100%', borderRadius: 3 }}>
            {/* <SideBar conversations={conversations} /> */}

            <Box component="main" sx={{ flexGrow: 1, p: 3, borderRadius: 3, overflowY: 'hidden', backgroundColor: "#fafafa" }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2,
                    maxHeight: '60vh',
                    minHeight: '60vh',
                    overflowY: 'auto',
                    padding: 2,
                }}
                    ref={scrollRef}
                >
                    {currentChat ? "" : "Start a conversation"}
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 1.5,
                                maxWidth: '75%',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                bgcolor: msg.role === 'user' ? 'lightgray' : '',
                                borderRadius: 2,
                            }}
                        >
                            {/* {currentChat ? "" : "Start a conversation"} */}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <Typography variant="h5" fontWeight="bold" gutterBottom {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <Typography variant="h6" fontWeight="bold" gutterBottom {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <Typography variant="body1" sx={{ mb: 1 }} {...props} />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <Typography component="span" fontWeight="bold" {...props} />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <Box component="ul" sx={{ pl: 3, mb: 1 }} {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li>
                                            <Typography variant="body1" component="span" {...props} />
                                        </li>
                                    ),
                                    code({ className, children, ...props }) {
                                        const isBlock = Boolean(className);

                                        return isBlock ? (
                                            <Box
                                                component="pre"
                                                sx={{
                                                    bgcolor: "grey.900",
                                                    color: "grey.100",
                                                    p: 2,
                                                    borderRadius: 2,
                                                    overflowX: "auto",
                                                    fontFamily: "monospace",
                                                    fontSize: "0.85em",
                                                    mt: 1,
                                                }}
                                            >
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </Box>
                                        ) : (
                                            <Box
                                                component="code"
                                                sx={{
                                                    bgcolor: "grey.200",
                                                    px: 0.5,
                                                    borderRadius: 0.5,
                                                    fontFamily: "monospace",
                                                    fontSize: "0.9em",
                                                }}
                                            >
                                                {children}
                                            </Box>
                                        );
                                    }
                                }}
                            >
                                {msg.message}
                            </ReactMarkdown>
                            {/* <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{msg.message}</Typography> */}
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', mt: 4 }}>
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
                    <IconButton color="primary" onClick={() => handleChat(selectedAgent.id, input, "user")} sx={{ ml: 1 }} disabled={input.trim() == "" || input.trim() === ''}>
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

    )
}

export default ChatScreen;
