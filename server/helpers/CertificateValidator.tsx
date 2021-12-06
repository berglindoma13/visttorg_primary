import { Certificate } from '../types/models'

interface CertificateValidatorProps {
  certificates: Array<Certificate>
  epdUrl?: string
  fscUrl?: string
  vocUrl?: string
}

export const CertificateValidator = ({ certificates, epdUrl, fscUrl, vocUrl } : CertificateValidatorProps) : Array<Certificate> => {

  const ValidCertificates: Array<Certificate> = []

  certificates.map((certificate: Certificate) => {
    switch(certificate.name) {
      case 'EPD':
        if(!!epdUrl){ValidCertificates.push({ name: 'EPD'})}
        break;
      case 'FSC':
        if(!!fscUrl){ValidCertificates.push({ name: 'FSC'})}
        break;
      case 'VOC':
        if(!!vocUrl){ValidCertificates.push({ name: 'VOC'})}
        break;
      case 'SV_ALLOWED':
        ValidCertificates.push({ name: 'SV_ALLOWED'})
        break;
      case 'SV':
        ValidCertificates.push({ name: 'SV'})
        break;
      case 'BREEAM':
        ValidCertificates.push({ name: 'BREEAM'})
        break;
      case 'BLENGILL':
        ValidCertificates.push({ name: 'BLENGILL'})
        break;
      default:
        break;
    }
  })

  return ValidCertificates
}

