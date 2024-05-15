import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Form, Input, Button, Typography, Space, Modal, Spin } from 'antd';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../Componente/LoginPage';
import SignUpPage from '../Componente/SignUpPage';
import { useCardStore } from '../Componente/CardStore';
import { myObject } from '../Componente/Fisier';
import profileImage from '../Componente/profileImage.jpg';

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

const users: User[] = [
    { username: 'Bob', password: '1234' },
    { username: 'Red', password: 'abcd1' },
];

const MyLayout: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [signUpVisible, setSignUpVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [editInput1, setEditInput1] = useState('');
    const [editInput2, setEditInput2] = useState('');
    const [editInput3, setEditInput3] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const store = useCardStore();

    const handleLogin = (values: FormValues) => {
        const { username, password } = values;
        const user: User | undefined = users.find((u) => u.username === username && u.password === password);
        if (user) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            Modal.error({ title: 'Eroare', content: 'Datele introduse sunt incorecte!' });
        }
    };

    const handleMenuClick = (page: string) => {
        window.location.href = `/${page}`;
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        setLogoutModalVisible(false);
        window.location.href = "/login"; // Navigăm către pagina de login
    };

    const cancelLogout = () => {
        setLogoutModalVisible(false);
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
        setIsLoading(true);
        setTimeout(() => {
            const newCard = {
                title: input1,
                content: input2,
                owner: input3,
            };
            store.addCard(newCard);
            setInput1('');
            setInput2('');
            setInput3('');
            setIsLoading(false);
        }, 2000);
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
        setIsLoading(true);
        setTimeout(() => {
            store.deleteCard(index);
            setIsLoading(false);
            window.location.href = "/acasa";
        }, 2000);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Router>
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
                        {isLoggedIn ? (
                            <>
                                <Menu.Item key="0">
                                    <Link to="/acasa">Acasa</Link>
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <Link to="/carduri">Carduri</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/input">Input</Link>
                                </Menu.Item>
                                <Menu.Item key="3" onClick={handleLogout}>
                                    Deconectare
                                </Menu.Item>
                            </>
                        ) : (
                            <Menu.Item key="0">
                                <Link to="/login">Autentificare</Link>
                            </Menu.Item>
                        )}
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <Routes>
                            <Route path="/acasa" element={<Home />} />
                            <Route path="/carduri" element={<Carduri store={store} handleEdit={handleEdit} handleDelete={handleDelete} />} />
                            <Route path="/input" element={<InputPage handleSubmit={handleSubmit} input1={input1} input2={input2} input3={input3} setInput1={setInput1} setInput2={setInput2} setInput3={setInput3} />} />
                            <Route path="/login" element={<LoginPage handleLogin={handleLogin} setSignUpVisible={setSignUpVisible} />} />
                        </Routes>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>TWEB LAB</Footer>
            </Router>
            <SignUpPage visible={signUpVisible} onClose={() => setSignUpVisible(false)} />
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
            <Modal
                title="Deconectare"
                visible={logoutModalVisible}
                onOk={confirmLogout}
                onCancel={cancelLogout}
                okText="Da"
                cancelText="Nu"
            >
                <p>Sigur doriți să vă deconectați?</p>
            </Modal>
            {isLoading && (
                <div style={{background: 'linear-gradient(in hsl,#97E7E1, #7AA2E3)', position: 'fixed', top: '60%', left: '60%', transform: 'translate(-65%, -65%)' }}>
                    <Spin size="large" />
                </div>
            )}
        </Layout>
    );
};

const Home = () => (
    <div style={{background: 'linear-gradient(in hsl,#97E7E1, #7AA2E3)',marginTop: '50vh', transform: 'translateY(-50%)', textAlign: 'left', position: 'relative'}}>
        <img src={profileImage} alt="Profile" style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            position: 'absolute',
            top: '-150px',
            left: 'calc(10% - 75px)'
        }}/>
        <h1>Lefter Sergiu-Dan</h1>
        <h2>CR-222</h2>
        <h2>Anul 2</h2>
        <h2>TWEB</h2>
        <h2>Laboratoare de la 3/7 </h2>


    </div>
);

interface CardProps {
    store: any;
    handleEdit: (index: number) => void;
    handleDelete: (index: number) => void;
}

const Carduri: React.FC<CardProps> = ({ store, handleEdit, handleDelete }) => (
    <div>
        {store.cards.length > 0 ? (
            store.cards.map((card: any, index: number) => (
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
    </div>
);

interface InputProps {
    handleSubmit: () => void;
    input1: string;
    input2: string;
    input3: string;
    setInput1: (value: string) => void;
    setInput2: (value: string) => void;
    setInput3: (value: string) => void;
}

const InputPage: React.FC<InputProps> = ({ handleSubmit, input1, input2, input3, setInput1, setInput2, setInput3 }) => (
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
);

export default observer(MyLayout);