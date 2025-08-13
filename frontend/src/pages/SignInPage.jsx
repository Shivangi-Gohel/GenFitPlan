import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center'>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/" />
    </main>
  )
}

export default SignInPage
