import React from 'react'
import chat from '../assets/chat-04.jpg'

const AuthLayouts = ({children}) => {
  return (
    <>
    <div>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white mt-5'>
            <img 
                src={chat}
                alt = 'chat'
                width = {150}
                height = {10}
                />
        </header>

    </div>

    {children}
    </>
  )
}

export default AuthLayouts
