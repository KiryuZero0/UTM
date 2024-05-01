// În SignUpPage.tsx

import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface SignUpPageProps {
    visible: boolean;
    onClose: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ visible, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        // Salvăm datele în localStorage sau în altă parte
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        onClose(); // Închidem modalul după ce s-a trimis formularul
    };

    return (
        <Modal
            title="Sign Up"
            visible={visible}
            onCancel={onClose}
            footer={null} // Dezactivăm butoanele implicite de la subsolul modalului
        >
            <Form onFinish={handleSubmit}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input value={username} onChange={handleUsernameChange} />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password value={password} onChange={handlePasswordChange} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Sign Up</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SignUpPage;
