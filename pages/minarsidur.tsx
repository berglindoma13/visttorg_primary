import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1 } from '../components/Typography';
import jwt_decode from 'jwt-decode';

interface User {
  fullName?: string
  email: string
  company?: string
  jobTitle?: string
  password: string
}

const minarsidur = () => {

  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('jwttoken');
    if(!!token){
      const decoded: any = jwt_decode(token);
      console.log("decoded", decoded);
      setUser({ fullName: decoded.fullname, jobTitle: decoded.jobtitle, company: decoded.company, email: decoded.email, password: decoded.password })
    }
  }, [])
  
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        {!!user && <Heading1>VELKOMIN {user.fullName}</Heading1> }
      </PageContainer>
    </Page>
  )
}

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const StyledHeader = styled(Header)`
  margin-bottom:50px;
`

export default minarsidur