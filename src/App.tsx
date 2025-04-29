import React from 'react';
import { Layout } from 'antd';
import HeaderComponent from './components/Header';
import FooterComponent from './components/Footer';
import MainContent from './components/MainContent';
import { CartProvider } from './context/CartContext';

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <CartProvider>
      <Layout className="min-h-screen">
        <Header className="bg-white shadow-md sticky top-0 z-50">
          <HeaderComponent />
        </Header>
        <Content>
          <MainContent />
        </Content>
        <Footer className="bg-gray-800 text-white">
          <FooterComponent />
        </Footer>
      </Layout>
    </CartProvider>
  );
};

export default App;