import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'

const Home = () => {
  return (
    <div>
      Home Page
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  )
}

export default Home
