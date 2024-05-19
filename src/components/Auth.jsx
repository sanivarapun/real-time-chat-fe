import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Heading, FormControl, FormLabel, VStack, Box } from '@chakra-ui/react';

const Auth = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
        try {
            const res = await axios.post(url, { username, password });
            if(!isLogin){
                alert(res.data.message)
            }
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
        } catch (error) {
            setError(error.response.data.error)
            console.error(error);
            alert(error.response.data.error)
        }
       
    };
   

    return (
        <Box width="400px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            <VStack spacing={4}>
                <Heading>{isLogin ? 'Login' : 'Sign Up'}</Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" size="sm" style={{marginTop:'25px'}}>{isLogin ? 'Login' : 'Sign Up'}</Button>
                </form>
                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Create Account' : 'Already have an account?'}
                </Button>
            </VStack>
        </Box>
    );
};

export default Auth;
