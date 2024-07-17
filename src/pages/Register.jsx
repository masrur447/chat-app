
import React from 'react'
import RegisterForm from '../components/auth/RegisterForm'

const Register = () => {
    return (
        <div className="w-full h-screen bg-slate-50 flex justify-center items-center">
            <div className="w-2/3 bg-white shadow-lg rounded-xl lg:flex overflow-hidden">
                <div className="w-full lg:w-1/2 bg-[url('/bg-2.jpg')] bg-no-repeat bg-cover bg-center">
                    <div className="w-full h-full py-16 px-2 lg:py-0 bg-black/50 flex flex-col justify-center items-center">
                        <h1 className='text-3xl text-white font-lato font-semibold text-center py-2'>Welcome Back</h1>
                        <p className='text-white font-lato text-center leading-normal -tracking-normal'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem praesentium accusantium quos iusto hic impedit dolore explicabo nulla ipsa quod?
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 py-16 px-12">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default Register