
import React from 'react'
import RegisterForm from '../components/auth/RegisterForm'

const Register = () => {
    return (
        <div className="w-full h-screen bg-slate-50 flex justify-center items-center">
            <div className="w-2/3 bg-white shadow-lg rounded-xl flex overflow-hidden">
                <div className="w-1/2 bg-[url('/public/bg-2.jpg')] bg-no-repeat bg-cover bg-center"></div>
                <div className="w-1/2 py-16 px-12">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default Register