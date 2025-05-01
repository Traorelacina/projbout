import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  Space, 
  Typography, 
  Divider, 
  Image,
  Modal,
  List,
  Badge,
  Empty
} from 'antd';
import { 
  ShoppingCartOutlined, 
  FileTextOutlined,
  PrinterOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/OrderHistory.css';

const { Title, Text } = Typography;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simuler un appel API
        const mockOrders: Order[] = [
          {
            id: 'ORD-2023-001',
            date: '2023-05-15',
            status: 'completed',
            items: [
              {
                id: '1',
                name: 'Smartphone Premium',
                price: 799.99,
                quantity: 1,
                image: 'https://via.placeholder.com/80'
              },
              {
                id: '2',
                name: 'Écouteurs sans fil',
                price: 129.99,
                quantity: 2,
                image: 'https://via.placeholder.com/80'
              }
            ],
            total: 1059.97,
            shippingAddress: '123 Rue de Paris, 75001, France',
            paymentMethod: 'Carte de crédit'
          },
          {
            id: 'ORD-2023-002',
            date: '2023-06-20',
            status: 'pending',
            items: [
              {
                id: '3',
                name: 'Montre connectée',
                price: 249.99,
                quantity: 1,
                image: 'https://via.placeholder.com/80'
              }
            ],
            total: 249.99,
            shippingAddress: '456 Avenue des Champs, 75008, France',
            paymentMethod: 'PayPal'
          }
        ];
        
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 800);
        
        // En production, utilisez :
        // const response = await client.get('/orders');
        // setOrders(response.data);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Terminée</Tag>;
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="processing">En cours</Tag>;
      case 'cancelled':
        return <Tag icon={<CloseCircleOutlined />} color="error">Annulée</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Commande',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text strong>€{total.toFixed(2)}</Text>
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<FileTextOutlined />} 
            onClick={() => {
              setSelectedOrder(record);
              setReceiptModalVisible(true);
            }}
          >
            Reçu
          </Button>
          <Button 
            type="text" 
            onClick={() => navigate(`/order/${record.id}`)}
          >
            Détails
          </Button>
        </Space>
      )
    }
  ];

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    message.info('Fonctionnalité de téléchargement à implémenter');
  };

  return (
    <div className="order-history-container">
      <Title level={2} className="page-title">
        <ShoppingCartOutlined /> Historique des Commandes
      </Title>
      
      {loading ? (
        <Card loading style={{ minHeight: 300 }} />
      ) : orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text>Aucune commande trouvée</Text>}
        >
          <Button type="primary" onClick={() => navigate('/products')}>
            Voir les produits
          </Button>
        </Empty>
      ) : (
        <>
          <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="orders-table"
          />
          
          <Modal
            title={`Reçu de commande #${selectedOrder?.id}`}
            visible={receiptModalVisible}
            onCancel={() => setReceiptModalVisible(false)}
            footer={[
              <Button key="print" icon={<PrinterOutlined />} onClick={handlePrintReceipt}>
                Imprimer
              </Button>,
              <Button 
                key="download" 
                icon={<DownloadOutlined />} 
                type="primary"
                onClick={handleDownloadReceipt}
              >
                Télécharger
              </Button>
            ]}
            width={800}
          >
            {selectedOrder && (
              <div className="receipt-container">
                <div className="receipt-header">
                  <Title level={4}>TechBoutique</Title>
                  <Text type="secondary">Reçu de commande</Text>
                </div>
                
                <Divider />
                
                <div className="receipt-info">
                  <Space size="large">
                    <div>
                      <Text strong>N° Commande:</Text>
                      <Text>{selectedOrder.id}</Text>
                    </div>
                    <div>
                      <Text strong>Date:</Text>
                      <Text>{new Date(selectedOrder.date).toLocaleString()}</Text>
                    </div>
                    <div>
                      <Text strong>Statut:</Text>
                      {getStatusTag(selectedOrder.status)}
                    </div>
                  </Space>
                </div>
                
                <Divider />
                
                <div className="receipt-items">
                  <Title level={5}>Articles</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={selectedOrder.items}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Image src={item.image} width={60} />}
                          title={item.name}
                          description={`Quantité: ${item.quantity} × €${item.price.toFixed(2)}`}
                        />
                        <div>€{(item.price * item.quantity).toFixed(2)}</div>
                      </List.Item>
                    )}
                  />
                </div>
                
                <Divider />
                
                <div className="receipt-summary">
                  <div className="summary-row">
                    <Text>Sous-total:</Text>
                    <Text>€{selectedOrder.total.toFixed(2)}</Text>
                  </div>
                  <div className="summary-row">
                    <Text>Livraison:</Text>
                    <Text>Gratuite</Text>
                  </div>
                  <Divider className="summary-divider" />
                  <div className="summary-row total">
                    <Text strong>Total:</Text>
                    <Text strong>€{selectedOrder.total.toFixed(2)}</Text>
                  </div>
                </div>
                
                <Divider />
                
                <div className="receipt-footer">
                  <div className="payment-method">
                    <Text strong>Méthode de paiement:</Text>
                    <Text>{selectedOrder.paymentMethod}</Text>
                  </div>
                  <div className="shipping-address">
                    <Text strong>Adresse de livraison:</Text>
                    <Text>{selectedOrder.shippingAddress}</Text>
                  </div>
                  <div className="thank-you">
                    <Text type="secondary">Merci pour votre achat !</Text>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default OrderHistory;