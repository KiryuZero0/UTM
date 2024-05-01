// În LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Modal } from 'antd';

const { Header, Content } = Layout;

interface LoginPageProps {
    handleLogin: (values: FormValues) => void;
    setSignUpVisible: (visible: boolean) => void; // Adăugăm prop-ul setSignUpVisible
}

interface FormValues {
    username: string;
    password: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ handleLogin, setSignUpVisible }) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Verificăm dacă există informații salvate în localStorage
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, []);

    const onFinish = () => {
        setLoading(true);
        // Simulăm procesul de autentificare
        setTimeout(() => {
            setLoading(false);
            if (username === 'Bob' && password === '1234') {
                localStorage.setItem('isLoggedIn', 'true');
                handleLogin({ username, password });
            } else {
                Modal.error({ title: 'Eroare', content: 'Datele introduse sunt incorecte!' });
            }
        }, 2000);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #222831, #35374B)' }}>
            <Header style={{ textAlign: 'center', color: '#FF204E', fontSize: '38px' }}>Login</Header>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 52px)' }}>
                <div style={{ width: '300px', background: '#76ABAE', padding: '60px', borderRadius: '40px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)' }}>
                    <Form
                        name="login"
                        initialValues={{ remember: true, username, password }} // Utilizăm valorile stocate în state-ul componentei
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="Username" value={username} onChange={handleUsernameChange} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" value={password} onChange={handlePasswordChange} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>Login</Button>
                        </Form.Item>

                        <Form.Item style={{textAlign: 'center'}}>
                            <a href="#/">Forget Password? </a>
                            <br></br> <a href="#/" onClick={() => setSignUpVisible(true)}> Not a Member? Sign up</a><></>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};
export default LoginPage;