import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    // Drawer,
    // List,
    //   ListItem,
    // ListItemButton,
    // ListItemText,
    Box,
    Button,
    // Stack,
} from '@mui/material';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { useNavigate } from 'react-router';
// import { MyContext } from '../src/context';
// import { AuthContext } from '../src/Context/AuthContext';
import { useUserContext } from '../src/Context/UserContext';
import { useAgents } from '../src/Hooks/useAgents';
import ChatDrawerSideBar from '../components/ChatDrawerSideBar'
// import { useChats } from '../src/Hooks/useChats';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate } from 'react-router';
// console.log(API_BASE_URL)

// const drawerWidth = 240;
// const appBarHeight = 64; // desktop
// // mobile AppBar is 56px


interface Chat {
    id: number
    user_id: number
    agent_id: number
    title: string
    created_date: Date
    summary: string
    message_start_index: number
    messages: Array<Message>
}

interface Message {
    chat_id: number;
    id: number;
    role: string;
    message: string;
    user_id: number;
    agent_id: number;
    created_date: Date
}


const Layout = () => {
    const { user, logout, isLoggedIn } = useUserContext();
    const { agents, selectedAgent, loading, error, fetchSingleAgent } = useAgents();
    // const { chats, messages, chatsLoading, chatsError } = useChats(user!.id, selectedAgent?.id);
    const [mainChats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<any>()
    const navigate = useNavigate();

    const childCurrentChat: Chat | null = mainChats.find(chat => chat.id == currentChatId) ?? null

    if (!user && isLoggedIn !== true) {
        throw new Error('AuthContext.Provider is missing in the component tree');
    }

    useEffect(() => {
        if (!user || !selectedAgent?.id) return;
        // console.log("Running Selected Agent")
        setIsLoading(true);
        const chats = async () => {

            if (user) {
                // console.log("Use Effect selected agent: ", selectedAgent)
                getChats(user.id, selectedAgent.id);
            }
        }
        chats()

    }, [selectedAgent?.id]);

    const appendToLastAssistantMessage = async (chatId: number, chunk: string) => {
        // console.log("Appending new message for Assistant.")
        setChats(prev =>
            prev.map(chat =>
                chat.id !== chatId
                    ? chat
                    : {
                        ...chat,
                        messages: chat.messages.map((m, i) =>
                            i === chat.messages.length - 1
                                ? { ...m, message: m.message + chunk }
                                : m
                        ),
                    }
            )
        );
    }

    const appendMessages = async (chatId: number, message: Message) => {
        setChats(prev =>
            prev.map(mainChat =>
                mainChat.id === chatId
                    ? { ...mainChat, messages: [...mainChat.messages, message] }
                    : mainChat
            )
        )
    }

    const addNewChat = async (chat: Chat) => {
        setChats(prev => [chat, ...prev])
        setSelectedIndex(chat.id)
    }

    const getChats = async (userId: number, agent_id: number) => {
        // Fetch chats logic here
        try {

            const res = await fetch(`${API_BASE_URL}/chats/?user_id=${userId}&agent_id=${agent_id}`)
            if (!res.ok) throw new Error("Failed to fetch user chats");
            const data = await res.json();
            // console.log("new_chats data: ", data)
            setChats(data);
            if (data.length === 0) {
                // console.log("length of data is 0")
                setCurrentChatId(null);
                setSelectedIndex(undefined);
                // setChatMessages([]);
                return
            } else {
                // setChatMessages(data[0]['messages']);
                // console.log("length of data is ELSE")
                setCurrentChatId(data[0].id);
                setSelectedIndex(data[0]["id"])
            }
        }
        catch (err) {
            console.error("Error fetching chats:", err);
        } finally {
            setIsLoading(false);
        }

    }

    const handleNewChat = () => {
        // setChatMessages([]);
        setCurrentChatId(null);
    }

    const handleAgentChange = (event: { target: { value: any; }; }) => {
        // Logic to handle agent change
        // console.log("Selected Agent: ", event.target.value);
        fetchSingleAgent(event.target.value)
        // setCurAgent(event.target.value)/

    }
    const handleSelectChat = (chat: Chat) => {
        // console.log("App Layout Chat (handleSelectChat): ", chat)
        setCurrentChatId(chat.id);
        // setChatMessages(chat['messages']);
        setSelectedIndex(chat.id)
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (isLoading) {
        return <div>Loading Chats...</div>;
    }
    if (error) {
        return <div>Error loading agents: {error}</div>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                // position: "relative"
            }}
        >
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                // sx={{ width: `calc(100% - ${drawerWidth}px)` }}
                sx={{ width: "100%" }}
                elevation={0}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: "white", elevation: 0 }}>
                    <Typography variant="h6" noWrap component="div" sx={{ color: "black" }}>
                        {user ? `Welcome, ${user.display_name}` : 'No user logged in'}
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        <Button onClick={() => navigate("/agent/admin")} sx={{ color: "black" }} >Admin</Button>
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        <Button onClick={logout} sx={{ color: "black" }} >Log Out</Button>
                    </Typography>

                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <ChatDrawerSideBar
                selectedAgent= {selectedAgent}
                handleAgentChange = {handleAgentChange}
                agents = {agents}
                handleNewChat = {handleNewChat}
                mainChats= {mainChats}
                handleSelectChat = {handleSelectChat}
                selectedIndex = {selectedIndex}
            />
            
            
                
            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 0 }}
            >
                {/*for spacing below AppBar  */}
                {/* <Toolbar />  */}
                <Outlet context={{ selectedAgent,childCurrentChat, currentChatId, getChats, setCurrentChatId, appendMessages, appendToLastAssistantMessage, addNewChat }} />
                {/* <Outlet context={{ selectedAgent, chatMessages, currentChat,  setCurrentChat }} /> */}
                {/* <Outlet /> */}
            </Box>
        </Box>
    );
};

export default Layout;
