import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Form, Input, Button, Typography, Space, Modal } from 'antd';
import { observer } from 'mobx-react';
import { useCardStore } from '../Componente/CardStore';
import { myObject } from '../Componente/Fisier';
import LoginPage from '../Componente/LoginPage';
import SignUpPage from '../Componente/SignUpPage'; // Importăm SignUpPage
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface User {
    username: string;
    password: string;
}

interface FormValues {
    username: string;
    password: string;
}

// Definim lista de utilizatori cu tipul User
const users: User[] = [
    { username: 'Octavian', password: 'octavian5' },
    // Adaugăm alți utilizatori aici
];

const MyLayout: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || 'Login');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [editIndex, setEditIndex] = useState(-1);
    const [editInput1, setEditInput1] = useState('');
    const [editInput2, setEditInput2] = useState('');
    const [editInput3, setEditInput3] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [signUpVisible, setSignUpVisible] = useState(false); // Starea pentru vizibilitatea paginii de înregistrare
    const store = useCardStore();

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const handleLogin = (values: FormValues) => {
        const { username, password } = values;
        const user: User | undefined = users.find((u) => u.username === username && u.password === password);
        if (user) {
            setIsLoggedIn(true);
            setCurrentPage('Acasa');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentPage', 'Acasa');
        } else {
            Modal.error({ title: 'Eroare', content: 'Datele introduse sunt incorecte!' });
        }
    };

    const handleMenuClick = (page: string) => {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('Login');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('currentPage', 'Login');
    };

    useEffect(() => {
        const storedCards = localStorage.getItem('cards');
        if (storedCards) {
            store.setCards(JSON.parse(storedCards));
        }
    }, [store]);

    useEffect(() => {
        const newCard = {
            title: myObject.field3,
            content: myObject.field6,
            owner: myObject.field4.join(', '),
        };
        const cardExists = store.cards.some((card) => card.title === newCard.title && card.content === newCard.content && card.owner === newCard.owner);
        if (!cardExists) {
            store.addCard(newCard);
        }
    }, [store]);

    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(store.cards));
    }, [store.cards]);

    const handleSubmit = () => {
        const newCard = {
            title: input1,
            content: input2,
            owner: input3,
        };
        store.addCard(newCard);
        setInput1('');
        setInput2('');
        setInput3('');
    };

    const handleEdit = (index: number) => {
        const card = store.cards[index];
        setEditIndex(index);
        setEditInput1(card.title);
        setEditInput2(card.content);
        setEditInput3(card.owner);
    };

    const handleSaveEdit = () => {
        const editedCard = {
            title: editInput1,
            content: editInput2,
            owner: editInput3,
        };
        store.editCard(editIndex, editedCard);
        setEditIndex(-1);
    };

    const handleDelete = (index: number) => {
        store.deleteCard(index);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
                    {isLoggedIn ? (
                        <>
                            <Menu.Item key="0" onClick={() => handleMenuClick('Acasa')}>
                                Acasa
                            </Menu.Item>
                            <Menu.Item key="1" onClick={() => handleMenuClick('Carduri')}>
                                Carduri
                            </Menu.Item>
                            <Menu.Item key="2" onClick={() => handleMenuClick('Input')}>
                                Input
                            </Menu.Item>
                            <Menu.Item key="3" onClick={handleLogout}>
                                Deconectare
                            </Menu.Item>
                        </>
                    ) : (
                        <Menu.Item key="0" onClick={() => handleMenuClick('Login')}>
                            Autentificare
                        </Menu.Item>
                    )}
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">
                    {currentPage === 'Login' && <LoginPage handleLogin={handleLogin} setSignUpVisible={setSignUpVisible} />}
                    {currentPage === 'Acasa' && (
                        <div style={{ marginTop: '50vh', transform: 'translateY(-50%)' }}>
                            <h1>Lefter Sergiu-Dan</h1>
                            <h2>CR-222</h2>
                        </div>
                    )}
                    {currentPage === 'Carduri' && (
                        <>
                            {store.cards.length > 0 ? (
                                store.cards.map((card, index) => (
                                    <Card key={index} style={{ width: 300, marginBottom: 16 }}>
                                        <Space direction="vertical">
                                            <Text strong>Nume Card: </Text>
                                            <Text>{card.title}</Text>
                                            <Text strong>Număr Card: </Text>
                                            <Text>{card.content}</Text>
                                            <Text strong>Nume Deținător: </Text>
                                            <Text>{card.owner}</Text>
                                            <Space style={{ marginTop: 16 }}>
                                                <Button type="primary" onClick={() => handleEdit(index)}>
                                                    Edit
                                                </Button>
                                                <Button type="primary" danger onClick={() => handleDelete(index)}>
                                                    Delete
                                                </Button>
                                            </Space>
                                        </Space>
                                    </Card>
                                ))
                            ) : (
                                <Text>No cards available</Text>
                            )}
                        </>
                    )}
                    {currentPage === 'Input' && (
                        <Card title="Card Template" style={{ width: 500, margin: 'auto', marginTop: 50 }}>
                            <Form onFinish={handleSubmit}>
                                <Form.Item label="Nume Card">
                                    <Input value={input1} onChange={(e) => setInput1(e.target.value)} />
                                </Form.Item>
                                <Form.Item label="Număr Card">
                                    <Input value={input2} onChange={(e) => setInput2(e.target.value)} />
                                </Form.Item>
                                <Form.Item label="Nume Deținător">
                                    <Input value={input3} onChange={(e) => setInput3(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Adăugați Card
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    )}
                    {editIndex !== -1 && (
                        <Modal
                            title="Edit Card"
                            visible={editIndex !== -1}
                            onOk={handleSaveEdit}
                            onCancel={() => setEditIndex(-1)}
                        >
                            <Form>
                                <Form.Item label="Nume Card">
                                    <Input value={editInput1} onChange={(e) => setEditInput1(e.target.value)} />
                                </Form.Item>
                                <Form.Item label="Număr Card">
                                    <Input value={editInput2} onChange={(e) => setEditInput2(e.target.value)} />
                                </Form.Item>
                                <Form.Item label="Nume Deținător">
                                    <Input value={editInput3} onChange={(e) => setEditInput3(e.target.value)} />
                                </Form.Item>
                            </Form>
                        </Modal>
                    )}
                    {/* Afișăm SignUpPage doar dacă signUpVisible este true */}
                    <SignUpPage visible={signUpVisible} onClose={() => setSignUpVisible(false)} />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>TWEB</Footer>
        </Layout>
    );
};

export default observer(MyLayout);
