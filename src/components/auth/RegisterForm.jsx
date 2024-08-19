import { useFormik } from 'formik'
import React, { useState } from 'react'

import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from 'firebase/auth'

import { getDatabase, ref, set } from 'firebase/database'

import { signUpSchema } from '../../validation/Index'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const RegisterForm = () => {

    const auth = getAuth()
    const db = getDatabase()

    const [loading, setLoading] = useState(false)

    const initialValues = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
    }
    const formik = useFormik({
        initialValues,
        validationSchema: signUpSchema,
        onSubmit: (values) => createUsers(values)
    })

    const createUsers = async ({ fullName, email, password }) => {

        setLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                await updateProfile(auth.currentUser, {
                    displayName: fullName
                }).then(async () => {
                    // insert users data in realtime database
                    const { uid } = auth.currentUser
                    await set(ref(db, 'users/' + uid), {
                        username: fullName,
                        email: email,
                        id: uid
                    })
                    await sendEmailVerification(auth.currentUser).then(() => {
                        toast.success('Please check your email to verify your account')
                    })
                })
                formik.resetForm()
            })
            .catch((error) => {
                if (error.message.includes('auth/email-already-in-use')) {
                    toast.error('Email already in use')
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

            <div className="flex flex-col px-4">
                <h2 className='text-3xl text-gray-500 font-lato font-semibold'>Register</h2>
                <p className='text-gray-500 font-lato mt-2'>Create your account. It's free and only take a minute</p>
                <form onSubmit={formik.handleSubmit}>
                    <div className="py-2">
                        <label htmlFor="name" className='text-gray-500 font-lato'>Full Name</label>
                        <input type="text" id="name" name='fullName' placeholder='Enter your full name' className='w-full border py-2 px-4 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.fullName} onChange={formik.handleChange} />
                        {formik.errors.fullName && formik.touched.fullName && <p className='text-red-500 text-sm'>{formik.errors.fullName}</p>}
                    </div>
                    <div className="py-2">
                        <label htmlFor="email" className='text-gray-500 font-lato'>Email</label>
                        <input type="email" id="email" name='email' placeholder='Enter your email' className='w-full border py-2 px-4 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.email} onChange={formik.handleChange} />
                        {formik.errors.email && formik.touched.email && <p className='text-red-500 text-sm'>{formik.errors.email}</p>}
                    </div>
                    <div className="py-2">
                        <label htmlFor="password" className='text-gray-500 font-lato'>Password</label>
                        <input type="password" id="password" name='password' placeholder='Enter your password' className='w-full border py-2 px-4 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.password} onChange={formik.handleChange} />
                        {formik.errors.password && formik.touched.password && <p className='text-red-500 text-sm'>{formik.errors.password}</p>}
                    </div>
                    <div className="py-2">
                        <label htmlFor="confirm_password" className='text-gray-500 font-lato'>Confirm Password</label>
                        <input type="password" id="confirm_password" name='confirmPassword' placeholder='Enter your password' className='w-full border py-2 px-4 font-lato bg-transparent rounded-md outline-none border-gray-500 focus:border-purple-500 focus:ring-purple-400' value={formik.values.confirmPassword} onChange={formik.handleChange} />
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className='text-red-500 text-sm'>{formik.errors.confirmPassword}</p>}
                    </div>
                    <div className="py-2">
                        <input type="checkbox" id="agree" name='agree' className='border border-gray-400 mr-2' value={formik.values.agree} onChange={formik.handleChange} />
                        <label className='text-gray-500 font-lato' htmlFor='agree'>I accept the <span className='text-purple-500 font-lato font-semibold cursor-pointer'>Terms of Use</span> and <span className='text-purple-500 font-lato font-semibold cursor-pointer'>Privacy Policy</span></label>
                        {
                            formik.errors.agree && formik.touched.agree && <p className='text-red-500 text-sm'>{formik.errors.agree}</p>
                        }
                    </div>
                    <div className="py-2">
                        <button type='submit' disabled={loading}
                            className='bg-purple-500 text-white font-lato py-2 px-4 rounded-md text-base w-full hover:bg-purple-700 transition flex justify-center items-center disabled:cursor-not-allowed'>
                            {/* spin svg */}
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent border-b-transparent animate-spin rounded-full"></div> : 'Register'}
                        </button>
                    </div>
                    <div className="py-2">
                        <p className='text-gray-500 font-lato'>Already have an account? <Link to='/login' className='text-purple-500 font-lato font-semibold cursor-pointer'>Login</Link></p>
                    </div>
                </form>
            </div>

        </>
    )
}

export default RegisterForm
