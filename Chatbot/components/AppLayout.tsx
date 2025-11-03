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

const drawerWidth = 240;

interface Chat {
    id: number;
    user_id: number;
    agent_id: number;
    title: string;
    creaded_date: Date;
    messages: Message[];
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
    const { agents, selectedAgent, loading, error } = useAgents();
    const [mainChats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat>({} as Chat);
    const [ selectedIndex, setSelectedIndex] = useState<any>()
    // const [newChat, setNewChat] = useState<boolean>(false);



    if (!user && isLoggedIn !== true) {
        throw new Error('AuthContext.Provider is missing in the component tree');
    }

    const getChats = async (userId: number) => {
        // Fetch chats logic here
        try {

            const res = await fetch(`http://127.0.0.1:8000/chats/?user_id=${userId}`)
            if (!res.ok) throw new Error("Failed to fetch user chats");
            const data = await res.json();
            console.log("Fetched Chats:", data)
            setChats(data);
            setChatMessages(data[0]['messages']);
            setCurrentChat(data[0]);
            setSelectedIndex(data[0]["id"])
            // console.log("messages: " , data[0]['messages'])
        }
        catch (err) {
            console.error("Error fetching chats:", err);
        } finally {
            setIsLoading(false);
        }

    }

    const handleNewChat = () => {
        console.log('Starting new chat');

        setChatMessages([]);
        // const newArr = [...mainChats, { title: "New Chat" } as Chat];
        // setChats(newArr);
        setCurrentChat({} as Chat);
        return
    }

    const handleAgentChange = (event: { target: { value: any; }; }) => {
        // Logic to handle agent change
        console.log(event.target.value);
        // setCurrentAgent(event.target.value);
        // selectAgent(asetCurrentAgentgent);

    }
    const handleSelectChat = (chat: Chat) => {
        setCurrentChat(chat);
        setChatMessages(chat['messages']);
        setSelectedIndex(chat.id)
        // setSelectedConversation(conversation);
    }

    useEffect(() => {
        setIsLoading(true);
        const chats = async () => {

            if (user) {
                getChats(user.id);
            }
        }
        chats()
        
    }, [selectedAgent]);


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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {user ? `Welcome, ${user.display_name}` : 'No user logged in'}
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
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', overflowX: 'hidden', zIndex: 15 },
                }}
            >
                <Toolbar />
                <Stack >
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Agent</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedAgent ? selectedAgent.id : ""}
                                label="Agent"
                                onChange={handleAgentChange}
                            >
                                {
                                    agents.map((agent: any) => (
                                        <MenuItem value={agent.id}>{agent.agent_name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100%', paddingTop: 2, bottom: 2 }}>
                        <Button
                            sx={{ 'position': "fixed" }}
                            variant="contained"
                            onClick={() => handleNewChat()}
                        >
                            New Chat
                        </Button>

                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', paddingTop: 10 }}>

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
                </Stack>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar /> {/* for spacing below AppBar */}
                <Outlet context={{ selectedAgent, chatMessages, currentChat, getChats, setCurrentChat }} />
                {/* <Outlet /> */}
            </Box>
        </Box>
    );
};

export default Layout;
