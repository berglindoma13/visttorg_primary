export interface ProductCertificate {
  fileurl : string
  certificate : Certificate
  validDate : Date
  certificateid: number
  productid: string
}

export interface Certificate {
  id : number,
  name : string
}

export interface CertificateSystem {
  name: string
}