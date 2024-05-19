import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Box, Input, Button, Select, Flex, Text, CSSReset } from '@chakra-ui/react';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    extraHeaders: {
        "Authorization": localStorage.getItem('token')
    }
});

const Chat = ({ token }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedReceiverId, setSelectedReceiverId] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setSelectedReceiverId(res.data._id);
                socket.emit('join', res.data._id);
                
                const messagesRes = await axios.get(`http://localhost:5000/api/messages/${res.data._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(messagesRes.data);
                
                const response = await axios.get('http://localhost:5000/api/auth/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, [token]);
    

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() && user && selectedReceiverId) {
            const newMessage = { sender: user._id, receiver: selectedReceiverId, content: message };
            socket.emit('message', newMessage);
            setMessage('');
        }
    };

    console.log(messages,"messages")

    return (
        <>
            <CSSReset />
            <Box width="600px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="6" h="600px" position="relative">
                <Text mb="2" textAlign="left" width="100%">Select Receiver:</Text>
                <Flex direction="column" align="flex-start" h="100%">
                    <Select 
                        placeholder="Select Receiver" 
                        onChange={(e) => setSelectedReceiverId(e.target.value)} 
                        mb="4"
                        defaultValue={user ? user._id : ""}
                        value={selectedReceiverId}
                    >
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                        ))}
                    </Select>

                    <Box flex="1" width="100%" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '0 !important' }, paddingBottom: '3.5rem' }}>
                        {messages.map((msg, index) => (
                            <Flex key={index} justify={msg.sender === user._id ? "flex-end" : "flex-start"} mb="2">
                                <Box bg={msg.sender === user._id ? "blue.400" : "gray.300"} p="2" borderRadius="lg">
                                    <Text color={msg.sender === user._id ? "white" : "black"}>{msg.sender.username}: {msg.content}</Text>
                                </Box>
                            </Flex>
                        ))}
                    </Box>
                    <Flex w="100%" position="absolute" bottom="0" left="0" pt= "0" pl="4" pr="4" pb="4" bg="white">
                        <Input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            mr="2"
                        />
                        <Button onClick={sendMessage} colorScheme="blue">Send</Button>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Chat;
