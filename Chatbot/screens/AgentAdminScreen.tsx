// import {useState} from 'react'
import { useAgents } from '../src/Hooks/useAgents';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function AgentAdminScreen() {
    const { agents, loading, error } = useAgents();
    const [ curAgent, setCurAgent] = useState<any>(null)
    const [ systemMessage, setSystemMessage ] = useState<any>(null)
    const navigate = useNavigate();

    // const systemMessageRef = useRef<any>(null)

    // const curAgent = agents[0]
    // console.log(systemMessage)


    useEffect(() => {
        if(!agents || agents.length === 0) return;
        setCurAgent(agents[0])
        setSystemMessage(agents[0]["system_message"])
    }, [agents])


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading agents: {error}</div>;
    }

    const handleAgentChange = (event: { target: { value: any; }; }) => {
        console.log(event.target.value)
        agents.map(agent => {
            if(agent.id == event.target.value) {
                setCurAgent(agent)
                setSystemMessage(agent.system_message)
            }
        })

    }

    const updateAgent = async (agent: any) => {

        try {
            agent.system_message = systemMessage
            // console.log(agent)
            const updatedAgent = await fetch(`${API_BASE_URL}/agent?agent_id=${agent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    agent_name: agent.agent_name,
                    description: agent.description,
                    created_date: agent.created_date,
                    id: agent.id,
                    model: agent.model,
                    // model_id: agent.model_id,
                    model_id: 4,

                    system_message: agent.system_message,
                    use_memory: agent.use_memory,
                    updated_date: new Date()
                }),
                
            })

            if(!updatedAgent.body) return

            const data = await updatedAgent.json();
            // console.log(data)

            return data

        }
        catch (error) {
            console.error("Error fetching chats:", error);
        }

    }

    return (
        <div>
            <h1>AgentAdminScreen</h1>
            <Box
                component="form"
                // sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
                display='flex'
                flexDirection='column'
            >
                <FormControl
                    fullWidth
                    sx={{ padding: 1 }}
                >
                    <InputLabel id="demo-simple-select-label">Agent</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={curAgent?.id ?? ''}
                        label="Agent"
                        onChange={handleAgentChange}
                    >
                        {agents.map((agent: any) => (

                            <MenuItem key={agent.id} value={agent.id}>
                                {agent.agent_name} {agent.model}
                            </MenuItem>

                        ))}

                    </Select>
                </FormControl>
                <TextField id="outlined-basic" label="System Message" variant="outlined" multiline={true} value={systemMessage}  onChange={(e) => setSystemMessage(e.target.value)}/>
                {/* <TextField id="filled-basic" label="Filled" variant="filled" />
                <TextField id="standard-basic" label="Standard" variant="standard" /> */}
                <Button variant="text" onClick={() => updateAgent(curAgent)}>Save</Button>
                <Button variant="text" onClick={() => navigate("/chat")}>Back to Chat</Button>
            </Box>
        </div>
    )
}
