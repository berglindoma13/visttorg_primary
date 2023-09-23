import React, { useState } from 'react';
import { ProductProps } from '../../types/products';
import { MainButton, MainButtonText } from '../Buttons';
import styled from 'styled-components';
import { Checkbox, Tooltip } from 'antd';
import { IconButton } from '../Buttons/iconButton';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface ProductTableProps {
  products: Array<ProductProps>
}

const ProductTable = ({ products }: ProductTableProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<ProductProps>>([]);

  const handleCheckboxChange = (event, item) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
    }
  };

  const handleDownload = (files: Array<string>) => {
    files.forEach(URL => window.open(URL))
  }

  const handleDownloadAll = () => {
    products.map(product => {
      const isSelected = selectedItems.filter(x => x.id === product.id).length > 0
      if(isSelected){
        handleDownload(product.certificates.map(c => c.fileurl))
      }
    })
  }  

  return (
    <div style={{ width: '100%', height: '100%' }}>
    <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
       <thead>
         <tr>
           <th></th> {/* Empty header for checkboxes */}
           <th style={{textAlign:'left'}}>Name</th>
           <th></th> {/* Empty header for button column */}
         </tr>
       </thead>
       <tbody>
         {products && products.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
             <td>
             <StyledCheckbox
                checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                onChange={(event) => handleCheckboxChange(event, item)}
                
              />
             </td>
             <StyledTd>{item.title}</StyledTd>
            <td style={{ display:'flex', flexDirection:'row', justifyContent: 'flex-end', alignItems: 'center', height: '100%'}}>
              <IconButton 
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(item.certificates.map(c => c.fileurl))}
              />
            </td>
           </tr>
         ))}
       </tbody>
     </table>
    <ButtonWrapper>
          <StyledMainButton text="Hlaða niður völdum skjölum" onClick={() => handleDownloadAll()} />
          <Tooltip placement="left" title='Gætir þurft að leifa "popup" glugga í vafra fyrir skjöl sem bjóða ekki uppá beint niðurhal'>
            <InfoCircleOutlined />
          </Tooltip>
    </ButtonWrapper>

   </div>
  );
};

export default ProductTable;

const StyledMainButton = styled(MainButton)`
  margin-right:10px;
`

const ButtonWrapper = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  margin-top: 20px;
`

const StyledTd = styled.td`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked {
    
    &:hover{
      .ant-checkbox-inner {
        background-color: ${({ theme }) => theme.colors.primary.base} !important;
        border-color: ${({ theme }) => theme.colors.primary.base} !important;
      }

      :after{
        border-color: ${({ theme }) => theme.colors.primary.base} !important;
      }
    }
    .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.colors.primary.base} !important;
      border-color: ${({ theme }) => theme.colors.primary.base} !important;
    } 

    :after{
        border-color: ${({ theme }) => theme.colors.primary.base} !important;
      }
  }
  
  .ant-checkbox-inner {
    height:20px;
    width: 20px;

    &:hover{
      background-color: ${({ theme }) => theme.colors.primary.base};
      border-color: ${({ theme }) => theme.colors.primary.base};
    }
  }
`