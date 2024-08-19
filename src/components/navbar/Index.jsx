import { useRef, useState } from 'react'
import CameraIcon from '../../icons/CameraIcon'
import ProfileIcon from '../../icons/ProfileIcon'
import LogoutIcon from '../../icons/LogoutIcon'
import MessageIcon from '../../icons/MessageIcon'
import { Navigate, NavLink } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { toast } from 'react-toastify'
import { logout } from '../../features/slice/LoginSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createPortal } from 'react-dom'
import UploadPhoto from '../UploadPhoto/Index'

const Navbar = () => {
  const user = useSelector((user) => user.login.user)

  const fileRef = useRef(null)

  const auth = getAuth()
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false)

  const signOut = () => {
    auth.signOut()
      .then(() => {
        toast.success('Sign Out Successful')
        dispatch(logout())
        return <Navigate to='/' />
      })
  }


  return (
    <>
      <div className="flex items-center justify-between py-3 px-7 bg-slate-900 rounded-t-md">
        <div className='flex items-center gap-x-2'>
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-orange-200 overflow-hidden">
              <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'} className='w-full h-full object-cover' />
            </div>
            <button type='button' className='absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center' onClick={() => setShowModal(true)}>
              <CameraIcon />
            </button>
          </div>
          <div>
            <span className='text-white font-serif'>{user?.displayName}</span>
          </div>
        </div>
        <div className='flex justify-center items-center gap-x-2'>
          <NavLink to='/' className='text-[#292D32] bg-white rounded-full w-10 h-10 cursor-pointer flex items-center justify-center [&.active]:bg-[#6CD0FB] [&.active]:text-[white]'>
            <ProfileIcon />
          </NavLink>
          <NavLink to='/message' className='text-[#292D32] bg-white rounded-full w-10 h-10 cursor-pointer flex items-center justify-center [&.active]:bg-[#6CD0FB] [&.active]:text-[white]'>
            <MessageIcon />
          </NavLink>
        </div>
        <div className='flex justify-center items-center gap-x-1 cursor-pointer'>
          <button className='text-[#6CD0FB] flex gap-x-1' onClick={signOut}>
            <LogoutIcon />
            <span className='text-white'>Log Out</span>
          </button>
        </div>
      </div>

      {
        showModal && (
          createPortal(
            <div>
              <UploadPhoto showModal={showModal} setShowModal={setShowModal} fileRef={fileRef} />
            </div>,
            document.body
          )
        )
      }
    </>
  )
}

export default Navbar
