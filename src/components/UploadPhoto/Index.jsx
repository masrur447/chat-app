import React, { createRef, useState } from 'react'
import Modal from '../Modal/Index'
import GalleryIcon from '../../icons/GalleryIcon'
import "cropperjs/dist/cropper.css";
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { getAuth, updateProfile } from 'firebase/auth';
import ImageCropper from './ImageCropper';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/slice/LoginSlice';
import { update, ref as Ref, getDatabase } from 'firebase/database';

function UploadPhoto({ showModal, setShowModal, fileRef }) {

    const user = useSelector((state) => state.login.user)
    const dispatch = useDispatch()

    const auth = getAuth()

    const storage = getStorage();
    const db = getDatabase();

    const [showCropper, setShowCropper] = useState(false)
    const [image, setImage] = useState("")
    const [cropData, setCropData] = useState("#")
    const cropperRef = createRef()

    const onChange = (e) => {
        e.preventDefault()
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files
        } else if (e.target) {
            files = e.target.files
        }
        const reader = new FileReader()
        reader.onload = () => {
            setImage(reader.result)

        };
        reader.readAsDataURL(files[0])
        setShowCropper(true)


    }

    const getCropData = () => {

        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
        }
        setShowCropper(false)

    }

    const uploadProfilePhoto = () => {
        if (user?.photoURL) {
            deleteObject(ref(storage, user?.photoURL))
        }

        const fileName = `${user.uid}-${Date.now()}`

        const storageRef = ref(storage, `profile/${fileName}`)

        // Data URL string
        const message4 = cropData;
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                update(Ref(db, `users/${user.uid}`), {
                    photoURL: downloadURL
                }).then(() => {
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                    }).then(() => {
                        dispatch(login({ ...user, photoURL: downloadURL }))
                    })
                })
            });
        });

        toast.success('Profile photo uploaded successfully')
        setShowModal(false)
    }




    return (
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div className="w-[600px] bg-white shadow-md rounded-md px-2">
                <h2 className='text-lg font-semibold text-center px-2 py-2'>Upload Photo</h2>
                {
                    !showCropper ? (
                        <>
                            <div className="flex items-center justify-center flex-col min-h-[300px] bg-slate-200 border border-slate-700 mb-3 cursor-pointer px-2 relative" onClick={() => fileRef.current.click()}>
                                {
                                    cropData !== "#" ? <>
                                        <img src={cropData} alt="profile" className="w-20 h-20 rounded-full object-cover" />
                                        <h4 className='text-center'>Click to change</h4>
                                    </> : (
                                        <>
                                            <GalleryIcon />
                                            <h4>Upload Your profile photo</h4>
                                        </>
                                    )
                                }
                                <input type="file" ref={fileRef} hidden accept='image/*' onChange={onChange} />

                            </div>

                            {
                                cropData !== "#" ? <button className='w-full px-2 py-2 my-2 bg-primary text-white rounded-md' onClick={uploadProfilePhoto}>Upload</button> : null
                            }
                        </>
                    ) : (
                        <ImageCropper image={image} getCropData={getCropData} cropperRef={cropperRef} />
                    )
                }
            </div>
        </Modal>
    )
}

export default UploadPhoto
