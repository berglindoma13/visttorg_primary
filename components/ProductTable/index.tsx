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

  const handleDownload = (files: Array<string>) => {
    files.forEach(URL => window.open(URL))
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
              {/* <DownloadButton href={item.certificates[0].fileurl}/> */}
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