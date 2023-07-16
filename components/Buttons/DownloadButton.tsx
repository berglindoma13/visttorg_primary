import React from 'react'

interface DownloadButtonProps {
  href: string
}

export const DownloadButton = ({ href }) => {
  return (
    <a
        href={href}
        download
      >
        <button>Download .pdf file</button>
      </a>
  )
}