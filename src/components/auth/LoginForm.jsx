import { useFormik } from 'formik'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { loginSchema } from '../../validation/Index'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { login } from '../../features/slice/LoginSlice'

const LoginForm = () => {

    const auth = getAuth()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const initialValues = {
        email: '',
        password: '',
        remember: false
    }

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => signIn(values)
    })

    const signIn = async ({ email, password }) => {

        setLoading(true)

        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                if(user.emailVerified) {
                    formik.resetForm()
                    dispatch(login(user))
                    toast.success('Login successful')
                    navigate('/')
                } else {
                    toast.error('Please verify your email')
                }
            })
            .catch((error) => {
                if(error.message.includes('auth/invalid-credential')) {
                    toast.error('Invalid credentials')
                } else {
                    toast.error('An error occurred please try again')
                }

            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
        <Helmet>
            <title>Login</title>
        </Helmet>
            <div className="flex flex-col px-4">
                <h2 className='text-3xl text-gray-500 font-lato font-semibold'>Sign In</h2>
                <p className='text-gray-500 font-lato mt-2'>Sign in to your account</p>

                <form className='mt-4' onSubmit={formik.handleSubmit}>
                    <div className="py-2">
                        <label htmlFor="email" className='text-gray-500 font-lato'>Email</label>
                        <input type="email" id="email" name='email' placeholder='Enter your email' className='w-full border py-2 px-4 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.email} onChange={formik.handleChange} />
                        {formik.errors.email && formik.touched.email && <p className='text-red-500 text-sm'>{formik.errors.email}</p>}
                    </div>

                    <div className="py-2">
                        <label htmlFor="password" className='text-gray-500 font-lato'>Password</label>
                        <input type="password" className='w-full border py-2 px-2 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.password} onChange={formik.handleChange} id="password" name='password' placeholder='Enter your password' />
                        {formik.errors.password && formik.touched.password && <p className='text-red-500 text-sm'>{formik.errors.password}</p>}
                    </div>
                    <div className="py-2">
                        <input type="checkbox" name="remember" id="remember" className='w-4 h-4' onChange={formik.handleChange} />
                        <label htmlFor="remember" className='text-gray-500 font-lato ml-2'>Remember me</label>
                    </div>
                    <div className="py-2">
                        <button type="submit" className='w-full bg-purple-500 text-white font-lato py-2 rounded-md disabled:cursor-not-allowed' disabled={loading}>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-b-transparent animate-spin rounded-full"></div> : 'Sign In'}
                        </button>
                    </div>

                    <p className='text-gray-500 font-lato mt-4'>Don't have an account? <Link to="/register" className='text-purple-500'>Sign Up</Link></p>
                </form>

            </div>
        </>
    )
}

export default LoginForm
