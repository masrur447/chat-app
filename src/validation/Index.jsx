import * as Yup from 'yup'



export const signUpSchema = Yup.object().shape({
    fullName: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Too Short!').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    agree: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')

})


export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Too Short!').required('Password is required'),
})
