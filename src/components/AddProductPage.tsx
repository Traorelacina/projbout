import React, { useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/AddProductPage.css';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: File | string;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
}

const AddProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez uploader que des fichiers images!');
    }
    return isImage;
  };

  const handleUploadChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Limiter à un seul fichier
    setFileList(fileList);
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} fichier uploadé avec succès`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} échec de l'upload.`);
    }
  };

  const onFinish = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      if (values.oldPrice) formData.append('oldPrice', values.oldPrice.toString());
      formData.append('category', values.category);
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }
      formData.append('stock', values.stock.toString());
      if (values.rating) formData.append('rating', values.rating.toString());
      formData.append('isNew', values.isNew?.toString() || 'false');
      formData.append('isPromo', values.isPromo?.toString() || 'false');

      // Utilisation du client axios configuré avec le bon header pour FormData
      const response = await client.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        message.success('Produit ajouté avec succès');
        form.resetFields();
        setFileList([]);
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
          label="Image du produit"
          rules={[{ required: true, message: 'Veuillez sélectionner une image' }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            fileList={fileList}
            accept="image/*"
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Sélectionner l'image</Button>
          </Upload>
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