import React from 'react'

interface DownloadButtonProps {
  href: string
}

export const DownloadButton = ({ href }) => {
  return (
    <a
        href={href}
        download="Example-PDF-document"
        target="_blank"
        rel="noreferrer"
      >
        <button>Download .pdf file</button>
      </a>
  )
}