import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

interface NewProduct {
  name: string
  productId: string
  sellingCompany: string
  shortDescription: string
  longDescription: string
  link: string
  brand: string
}

const FormPage = () => {
  const [productImage, setProductImage] = useState(null)
  const [certificates, setCertificates] = useState(null)
  const [newProduct, setNewProduct] = useState<NewProduct>(null)

  const productImageChange = (event) => {
    setProductImage(event.target.files[0])
  }

  const certificateChange = (event) => {
    setCertificates([event.target.files[0], {...certificates}])
  }

  const newProductChange = (key: string, value: string) => {
    setNewProduct({ [key]: value, ...newProduct})
  }

  const fileUploader = () => {
    var bodyFormData = new FormData();
    
    bodyFormData.append('name', newProduct['name']);
    bodyFormData.append('productId', newProduct['productId']);
    bodyFormData.append('company', newProduct['sellingCompany']);
    bodyFormData.append('shortDescription', newProduct['shortDescription']);
    bodyFormData.append('longDescription', newProduct['longDescription']);
    bodyFormData.append('link', newProduct['link']);
    bodyFormData.append('brand', newProduct['brand']);
    bodyFormData.append('productImage', productImage);
    bodyFormData.append('certificates', certificates);

    axios.post('/api/product/add', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  return( 
    <>
      <PageTitle>Nýskráning á vöru</PageTitle>
      <FormWrapper>
        {/* <TextInput type="text" placeholder="Nafn á vöru" onChange={(value: string) => newProductChange('name', value)}/>
        <TextInput type="text" placeholder="Vörunúmer (einstakt)" onChange={(value: string) => newProductChange('productId', value)}/>
        <TextInput type="text" placeholder="Seljandi" onChange={(value: string) => newProductChange('sellingCompany', value)}/>
        <TextareaInput placeholder="Stutt lýsing" onChange={(value: string) => newProductChange('shortDescription', value)}/>
        <TextareaInput placeholder="Lengri lýsing" onChange={(value: string) => newProductChange('longDescription', value)}/>
        <TextInput type="text" placeholder="Hlekkur á vöru" onChange={(value: string) => newProductChange('link', value)}/>
        <TextInput type="text" placeholder="Vörumerki" onChange={(value: string) => newProductChange('brand', value)}/>
        <TextInput type="file" name="productimage" onChange={productImageChange} />
        <TextInput type="file" name="certificate" onChange={certificateChange} /> */}
      </FormWrapper>
      <SubmitButton onClick={() => fileUploader()}>Senda inn</SubmitButton>
    </>
  )
}

export default FormPage

const PageTitle = styled.h1`
  font-size: max(1.1vw, 28px);
  color:black;
  padding-left:20px;
  padding-top:20px;
`

const TextInput = styled.input`
  height: 45px;
  width: 100%;
  margin-bottom: 15px;
  padding-left:15px;
`

const TextareaInput = styled.textarea`
  min-height: 70px;
  width: 100%;
  margin-bottom: 15px;
  padding-left:15px;
`

const FormWrapper = styled.div`
  display:flex;
  flex-direction:column;
  padding: 20px;
`

const SubmitButton = styled.button`
  height: 45px;
  width: 100px;
  background-color: rebeccapurple;
  color:white;
  border:none;
  margin-left:20px;
`