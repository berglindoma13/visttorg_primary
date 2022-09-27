export interface ProductCertificate {
  fileurl : string
  certificate : Certificate
  validDate : Date
  certificateid: number
}

export interface Certificate {
  id : number,
  name : string
}