import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'
import { MainButton } from '../Buttons'

interface PaginationProps{
  total: number
  currentPage: number
  setCurrentPage: (number) => void
  queryParamName: string
  pageSize: number
}

export const Pagination = ({ total, currentPage, setCurrentPage, queryParamName, pageSize }: PaginationProps) => {
  const numberOfPages = Math.ceil(total / pageSize);
  const getPages = () => {
    let pages = []
    const indexStart = currentPage < 5 ? 1 : currentPage > numberOfPages - 5 ? numberOfPages - 5 : currentPage - 2
    if(numberOfPages > 6){
      for(let x = indexStart; x < indexStart + 5; x++){
        pages.push(<StyledNumberButton key={x} onClick={() => setCurrentPage(x)} className={currentPage === x ? 'active': ''}>{x}</StyledNumberButton>)
      }
      if(currentPage <= numberOfPages - 5){
        pages.push(<StyledDots key="...">...</StyledDots>)
      }
      pages.push(<StyledNumberButton key={numberOfPages} onClick={() => setCurrentPage(numberOfPages)} className={currentPage === numberOfPages ? 'active': ''}>{numberOfPages}</StyledNumberButton>)
    }else{
      for(let x = 1; x <= Math.ceil(total / pageSize); x++){
        pages.push(<StyledNumberButton key={x} onClick={() => setCurrentPage(x)} className={currentPage === x ? 'active': ''}>{x}</StyledNumberButton>)
      }
    }

    return pages
  }

  return (
    <StyledPagination>
      <MainButton 
        text="Til baka" 
        onClick={() => {
          if(currentPage > 1){
            setCurrentPage(currentPage - 1)
          }
        }} 
        className={currentPage > 1 ? '' : 'disabled'}
      />
      <DesktopOnly>
        {getPages()}
      </DesktopOnly>
      <MobileOnly>
        <ProgressBar percentage={(currentPage / numberOfPages) * 100}></ProgressBar>
      </MobileOnly>
      <MainButton 
        text="Áfram" 
        onClick={() => {
          if(currentPage < Math.ceil(total / pageSize)){
            setCurrentPage(currentPage + 1)
          }
        }} 
        className={currentPage < Math.ceil(total / pageSize) ? '' : 'disabled'}
      />
    </StyledPagination>
  )
}

const StyledPagination = styled.div`
  height: 56px;
  width: 100%;
  padding: 0 clamp(0px, 20vw, 400px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media ${mediaMax.tablet}{
    padding: 0 15px;
  }
`

const DesktopOnly = styled.div`
  display:flex;
  width:100%;
  flex-direction: row;
  justify-content: center;
  @media ${mediaMax.tablet}{
    display:none;
  }
`

const MobileOnly = styled.div`
  display:none;
  @media ${mediaMax.tablet}{
    display:block;
    width:100%;
    margin: 0 20px;
  }
`
interface ProgressBarProps{
  percentage: number
}
const ProgressBar = styled.div<ProgressBarProps>`
  height: 3px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey_two};
  position:relative;

  &:after{
    content: "";
    height:3px;
    width: ${({ percentage })=> `${percentage}%`};
    background-color: #000;
    position:absolute;
    left:0;
    top:0;
  }
`

const StyledNumberButton = styled.button`
  height: 56px;
  border-radius: 999px;
  width: 64px;
  padding: 16px;
  border:none;
  cursor: pointer;
  background-color:transparent;
  &:hover, &.active{
    box-shadow: 0px 8px 64px 6.23529px rgba(139, 139, 139, 0.24);
    background-color: #fff;
  }
`

const StyledDots = styled.div`
  height: 56px;
  width: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`