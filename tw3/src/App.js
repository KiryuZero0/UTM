import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, Form, Input, Button, theme, Tabs, Card, message } from 'antd';

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const [myCards, setMyCards] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenerate = () => {
        const cardNumber = generateRandomCardNumber();
        const expiryDate = generateRandomExpiryDate();
        const cvc = generateRandomNumber(3);
        setFormData({ ...formData, cardNumber, expiryDate, cvc });
    };

    const handleSaveCard = () => {
        if (!formData.name || !formData.expiryDate || !formData.cvc) {
            message.error('Completați toate câmpurile!');
            return;
        }
        if (formData.cvc.length !== 3) {
            message.error('CVC-ul trebuie să aibă exact 3 cifre!');
            return;
        }
        const cardNumber = generateRandomCardNumber();
        const newCard = { ...formData, cardNumber };
        setMyCards([...myCards, newCard]);
        setFormData({
            name: '',
            cardNumber: '',
            expiryDate: '',
            cvc: '',
        });
        message.success('Cardul a fost salvat cu succes!');
    };

    const generateRandomNumber = (length: number) => {
        let result = '';
        const characters = '0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const generateRandomExpiryDate = () => {
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5));
        return `${month}/${year}`;
    };

    const generateRandomCardNumber = () => {
        let cardNumber = '';
        for (let i = 0; i < 16; i++) {
            cardNumber += generateRandomNumber(1);
            if ((i + 1) % 4 === 0 && i < 15) {
                cardNumber += ' ';
            }
        }
        return cardNumber;
    };

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    <Menu.Item key="1">Card 1</Menu.Item>
                    <Menu.Item key="2">Card 2</Menu.Item>
                    <Menu.Item key="3">Card 3</Menu.Item>
                    <Menu.Item key="4">My Cards</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Creare" key="1">
                        <div
                            style={{
                                padding: 24,
                                minHeight: 380,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Form layout="vertical">
                                <Form.Item label="Numele">
                                    <Input name="name" value={formData.name} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="Data expirării">
                                    <Input name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="CVC">
                                    <Input
                                        name="cvc"
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        maxLength={3}
                                        type="number"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleSaveCard}>Salvează card</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </TabPane>
                    <TabPane tab="My Cards" key="4">
                        <div
                            style={{
                                padding: 24,
                                minHeight: 380,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {myCards.map((card, index) => (
                                <Card key={index} title={`Card ${index + 1}`}>
                                    <p>Nume: {card.name}</p>
                                    <p>Număr card: {card.cardNumber}</p>
                                    <p>Data expirării: {card.expiryDate}</p>
                                    <p>CVC: {card.cvc}</p>
                                </Card>
                            ))}
                        </div>
                    </TabPane>
                </Tabs>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default App;
