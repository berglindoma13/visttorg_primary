import React, { useState } from 'react';
import { ProductProps } from '../../types/products';
import { MainButton } from '../Buttons';
import styled from 'styled-components';
import { Checkbox } from 'antd';
import { IconButton } from '../Buttons/iconButton';
import { DownloadOutlined } from '@ant-design/icons';
import { DownloadButton } from '../Buttons/DownloadButton';

interface ProductTableProps {
  products: Array<ProductProps>
}

const ProductTable = ({ products }: ProductTableProps) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (event, item) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
    }
  };

  return (
     <div style={{ width: '100%', height: '100%' }}>
      <table style={{ width: '100%', height: '100%' }}>
       <thead>
         <tr>
           <th></th> {/* Empty header for checkboxes */}
           <th style={{textAlign:'left'}}>Name</th>
           <th></th> {/* Empty header for button column */}
         </tr>
       </thead>
       <tbody>
         {products && products.map((item) => (
           <tr key={item.id}>
             <td>
             <StyledCheckbox
                checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                onChange={(event) => handleCheckboxChange(event, item)}
                
              />
             </td>
             <StyledTd>{item.title}</StyledTd>
            <td>
              {/* <IconButton 
                icon={<DownloadOutlined />}
                onClick={() => console.log('clicking this')}
              /> */}
              <DownloadButton href="https://www.schomburg.com/de/de/dateien/modified-mineral-mortars-group-1/FEICA-EPD_Modified%20mineral%20mortars,%20group%201.pdf"/>
            </td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
  );
};

export default ProductTable;

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