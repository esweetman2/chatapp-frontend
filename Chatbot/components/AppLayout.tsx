import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Drawer,
    List,
    //   ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Button,
    Stack,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import { useNavigate } from 'react-router';
// import { MyContext } from '../src/context';
// import { AuthContext } from '../src/Context/AuthContext';
import { useUserContext } from '../src/Context/UserContext';
import { useAgents } from '../src/Hooks/useAgents';
// import { useChats } from '../src/Hooks/useChats';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// console.log(API_BASE_URL)

const drawerWidth = 240;
const appBarHeight = 64; // desktop
// mobile AppBar is 56px


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
    // const mainChats = chats
    // const isLoading = chatsLoading
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<any>()
    // const [curAgent, setCurAgent] = useState(selectedAgent)
    // const [newChat, setNewChat] = useState<boolean>(false);
    // console.log("Main Selected Agent: ", selectedAgent)
    // console.log(chatsLoading, chatsError, chats, messages)


    if (!user && isLoggedIn !== true) {
        throw new Error('AuthContext.Provider is missing in the component tree');
    }

    // useEffect(() => {
    //     if (!chats.length) {
    //         setCurrentChat(null);
    //         setChatMessages([]);
    //         setSelectedIndex(undefined);
    //         return;
    //     }

    //     setCurrentChat(chats[0]);
    //     setChatMessages(chats[0].messages);
    //     setSelectedIndex(chats[0].id);
    // }, [chats]);

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
                setCurrentChat({} as Chat);
                setSelectedIndex(undefined);
                setChatMessages([]);
                return
            } else {
                setChatMessages(data[0]['messages']);
                // console.log("length of data is ELSE")
                setCurrentChat(data[0]);
                setSelectedIndex(data[0]["id"])
            }
        }
        catch (err) {
            console.error("Error fetching chats:", err);
        } finally {
            setIsLoading(false);
        }

    }

    // const processChats = () => {
    //     try {

    //         if (chats.length === 0) {
    //             console.log("length of data is 0")
    //             setCurrentChat({} as Chat);
    //             setSelectedIndex(undefined);
    //             return
    //         } else {
    //             console.log("length of data is ELSE")
    //             // setCurrentChat(chats[0]);
    //             setSelectedIndex(chats[0]["id"])
    //         }
    //     }
    //     catch (err) {
    //         console.error("Error fetching chats:", err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const handleNewChat = () => {
        setChatMessages([]);
        setCurrentChat(null);
        return
    }

    // useEffect(() => {
    //     handleAgentChange

    // }, [selectedAgent])

    const handleAgentChange = (event: { target: { value: any; }; }) => {
        // Logic to handle agent change
        // console.log("Selected Agent: ", event.target.value);
        fetchSingleAgent(event.target.value)
        // setCurAgent(event.target.value)/

    }
    const handleSelectChat = (chat: Chat) => {
        setCurrentChat(chat);
        setChatMessages(chat['messages']);
        setSelectedIndex(chat.id)
    }

    // useEffect(() => {
    //     processChats()
    // }, [])
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
                        <Button onClick={logout} sx={{ color: "black" }} >Log Out</Button>
                    </Typography>

                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', overflowX: 'hidden', zIndex: 15, top: `${appBarHeight}px`, height: "100%" },
                    height: `calc(100vh - ${appBarHeight}px)`,
                    overflowY: 'hidden',
                }}
            >
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '90%',
                    overflowY: 'hidden',
                }}>
                    <Stack sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        // overflowX: 'hidden',
                        paddingTop: 2,
                    }}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            // height: '100%',

                        }}>
                            {/* <Toolbar /> */}
                            <FormControl
                                fullWidth
                                sx={{ padding: 1 }}
                            >
                                <InputLabel id="demo-simple-select-label">Agent</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedAgent?.id ?? ''}
                                    label="Agent"
                                    onChange={handleAgentChange}
                                >
                                    {agents.map(agent => (

                                        <MenuItem key={agent.id} value={agent.id}>
                                            {agent.agent_name}
                                        </MenuItem>

                                    ))}

                                </Select>
                            </FormControl>

                            {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100%', paddingTop: 2, bottom: 2,overflowX: 'hidden' }}> */}
                            <Button
                                sx={{ margin: 2, }}
                                variant="contained"
                                onClick={() => handleNewChat()}
                            >
                                New Chat
                            </Button>

                            {/* </Box> */}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', overflowX: 'hidden', height: '90%' }}>
                            <List>
                                {mainChats.length > 0 ?
                                    mainChats.map((conversation, index) => (
                                        <ListItemButton key={index}
                                            onClick={() => handleSelectChat(conversation)}
                                            selected={selectedIndex === conversation.id}
                                            sx={{
                                                '&.Mui-selected': {
                                                    backgroundColor: 'primary.main', // Example: change background color
                                                    color: 'white', // Example: change text color
                                                    '&:hover': {
                                                        backgroundColor: 'primary.dark', // Example: change hover background for selected state
                                                    },
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                sx={{ overflow: 'hidden', maxWidth: '200px', textOverflow: 'ellipsis' }}
                                                primary={
                                                    <Typography noWrap sx={{ fontSize: 12 }}>
                                                        {` ${conversation.id}: ${conversation.title}` || `Conversation ${index + 1}`}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    ))
                                    :
                                    <ListItemText primary="No conversations available" />
                                }
                                {/* <ListItemText primary="No conversations available" /> */}
                                {/* Add more sidebar links here */}
                            </List>
                        </Box>
                    </Stack >
                </Stack>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 0 }}
            >
                {/*for spacing below AppBar  */}
                {/* <Toolbar />  */}
                <Outlet context={{ selectedAgent, chatMessages, currentChat, getChats, setCurrentChat }} />
                {/* <Outlet context={{ selectedAgent, chatMessages, currentChat,  setCurrentChat }} /> */}
                {/* <Outlet /> */}
            </Box>
        </Box>
    );
};

export default Layout;
