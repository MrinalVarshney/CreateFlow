import React, {useEffect, useState} from 'react'
import AuthBox from '../../shared/Components/AuthBox'
import LoginInputs from './LoginInputs'
import LoginPageFooter from './LoginPageFooter'
import { validateLoginForm } from '../../shared/utils/FomValidator'

const Login = () => {
  const [mail,setMail] = useState('')
  const [password,setPassword] = useState('')
  const [isFormValid,setIsFormValid] = useState(false)
  
  const handleLogin = ()=>{
  }
  
  useEffect(()=>{
    setIsFormValid(validateLoginForm({mail,password}))
  },[mail,password])

  return (
    <AuthBox>
       <LoginInputs mail={mail} setMail={setMail} password={password} setPassword={setPassword}/>
      <LoginPageFooter isFormValid={isFormValid} handleLogin={handleLogin}/> 
    </AuthBox>
  )
}

export default Login
