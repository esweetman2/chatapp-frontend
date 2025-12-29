// import React from 'react'

import {
    // AppBar,
    // Toolbar,
    Typography,
    // CssBaseline,
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

const drawerWidth = 240;
const appBarHeight = 64;

interface ChatDrawerSideBarProps {
    selectedAgent: any;
    handleAgentChange: any;
    agents: any;
    handleNewChat: any;
    mainChats: any;
    handleSelectChat: any;
    selectedIndex: any;
}

export default function ChatDrawerSideBar({selectedAgent, handleAgentChange, agents, handleNewChat, mainChats, handleSelectChat, selectedIndex}: ChatDrawerSideBarProps) {
  return (
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
                                        {agents.map((agent:any) => (
    
                                            <MenuItem key={agent.id} value={agent.id}>
                                                {agent.agent_name} {agent.model}
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
                                        mainChats.map((conversation: any, index: any) => (
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
  )
}
