// import React from 'react'
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    // IconButton,
    // Paper,
    // TextField,
    Typography,
    // CircularProgress
} from '@mui/material';


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

interface ChildCurrentChat {
    childCurrentChat: Chat
}

const ChatWindow = ({childCurrentChat}: ChildCurrentChat) => {
    return (
        <>

        {childCurrentChat.messages.map((msg: any, index: any) => (
            <Box
            key={index}
                    sx={{
                        // display: 'flex',
                        // alignItems: 'flex-end',
                        p: 1.5,
                        mb: 3,
                        maxWidth: '75%',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        bgcolor: msg.role === 'user' ? 'lightgray' : '',
                        borderRadius: 2,
                        // height: "100%"
                        overflow: "auto",
                        fontFamily: "cursive"
                    }}
                >
                    {/* {currentChat ? "" : "Start a conversation"} */}

                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => (
                                <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "sans-serif" }} gutterBottom {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "sans-serif" }} gutterBottom {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <Typography variant="body1" sx={{ mb: 1, fontFamily: "sans-serif" }} {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <Typography component="span" fontWeight="bold" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <Box component="ul" sx={{ pl: 3, mb: 1, fontFamily: "cursive" }} {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li>
                                    <Typography variant="body1" component="span" sx={{ fontFamily: "sans-serif" }} {...props} />
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
                                        fontFamily: "cursive",
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
                                        fontFamily: "cursive",
                                        fontSize: "0.9em",
                                    }}
                                    >
                                        {children}
                                    </Box>
                                );
                            }
                        }}
                        >
                        {/* <Typography variant="body1" component="h2"> */}
                        {msg.message}
                        {/* </Typography> */}
                    </ReactMarkdown>

                    {/* <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{msg.message}</Typography> */}
                </Box>
            ))}
            </>
    )
}

export default ChatWindow;

