import React, { useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import client from '../api/client'; // Importez le client axios configuré
import '../styles/AddProductPage.css';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
}

const AddProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      // Utilisation du client axios configuré
      const response = await client.post('/products', values);
      
      if (response.status === 201) {
        message.success('Produit ajouté avec succès');
        form.resetFields();
        navigate('/products');
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (error: any) {
      let errorMessage = 'Erreur lors de l\'ajout du produit';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion.';
      }
      
      message.error(errorMessage);
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Ajouter un nouveau produit</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="product-form"
      >
        <Form.Item 
          name="name" 
          label="Nom du produit" 
          rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
        >
          <Input placeholder="Nom du produit" />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Description" 
          rules={[{ required: true, message: 'Veuillez entrer une description' }]}
        >
          <Input.TextArea rows={4} placeholder="Description du produit" />
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Prix" 
          rules={[{ required: true, message: 'Veuillez entrer le prix', type: 'number' }]}
        >
          <InputNumber 
            min={0} 
            step={0.01} 
            style={{ width: '100%' }} 
            placeholder="Prix en €" 
          />
        </Form.Item>

        <Form.Item name="oldPrice" label="Ancien prix (optionnel)">
          <InputNumber 
            min={0} 
            step={0.01} 
            style={{ width: '100%' }} 
            placeholder="Ancien prix en €" 
          />
        </Form.Item>

        <Form.Item 
          name="category" 
          label="Catégorie" 
          rules={[{ required: true, message: 'Veuillez entrer la catégorie' }]}
        >
          <Input placeholder="Catégorie du produit" />
        </Form.Item>

        <Form.Item 
          name="image" 
          label="URL de l'image" 
          rules={[{ 
            required: true, 
            message: 'Veuillez entrer l\'URL de l\'image',
            type: 'url',
          }]}
        >
          <Input placeholder="URL complète de l'image (ex: https://example.com/image.jpg)" />
        </Form.Item>

        <Form.Item 
          name="rating" 
          label="Note (0-5)"
          initialValue={3}
        >
          <InputNumber 
            min={0} 
            max={5} 
            step={0.1} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item 
          name="stock" 
          label="Stock disponible" 
          rules={[{ required: true, message: 'Veuillez entrer le stock', type: 'number' }]}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            placeholder="Quantité en stock" 
          />
        </Form.Item>

        <Form.Item 
          name="isNew" 
          label="Nouveau produit" 
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        <Form.Item 
          name="isPromo" 
          label="En promotion" 
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Ajouter le produit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductPage;