export const readCookie = (cookieName: string) => {
  const cookies = document.cookie.split(';')
  console.log('allcookies', cookies)
  let myCookie: string = "";
  cookies.forEach((cookie) => {
    const c = cookie.replaceAll(" ", "")
    if(c.startsWith(cookieName)){
      myCookie = cookie.replace(`${cookieName}=`,"");
    }
  })
  return myCookie
}