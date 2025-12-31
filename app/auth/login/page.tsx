"use client"

import LoginForm from "@/components/auth/login/login-form"
import SecurityNotice from "@/components/auth/login/security-notice"

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <SecurityNotice />
    </>
  )
}