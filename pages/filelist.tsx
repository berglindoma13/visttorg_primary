import { GetServerSideProps } from 'next';
import React from 'react'
import {prismaInstance} from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = 1

  // const allFiles = await prismaInstance.attachedFile.findMany({})
  // console.log('allFiles', allFiles)
  // let b64
  // allFiles.map((file) => {
  //   b64 = Buffer.from(file.filebytes).toString('base64')
  // })
  
  return {
    props: {
      id,
      //b64
    },
  }
}

const FileList = ({ b64 }) => {
  const mimeType = 'image/png'
  return(
    // <img src={`data:${mimeType};base64,${b64}`} />
    <div></div>
  )
}

export default FileList