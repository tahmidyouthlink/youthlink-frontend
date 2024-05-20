"use client";
import Loading from '@/components/shared/Loading/Loading';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useWorks from '@/hooks/useWorks';
import { FaEye } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Image from 'next/image';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import PrivateRoute from '@/utils/Provider/PrivateRoute';
import { FiPlus } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AllWork = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [allWork, isWork, refetch] = useWorks();
    const [details, setDetails] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const axiosPublic = useAxiosPublic();

    function open(id) {
        setOpenModal(true);
        const singleData = allWork?.find(work => work?._id === id);
        setDetails(singleData);
    }


    const onSubmit = async (data) => {
        const title = data.title;
        const heading = data.heading;
        const aboutTheProject = data.aboutTheProject;
        const ourSolution = data.ourSolution;
        const theResults = data.theResults;
        const keyword = data.keyword;
        const category = data.category;
        const photo = data.photo[0];
        const photoObj = { image: photo }
        const uploadImage = await axiosPublic.post(apiURL, photoObj, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        const imageURL = uploadImage?.data?.data?.display_url;
        const workInfo = { title, heading, keyword, category, aboutTheProject, ourSolution, theResults, imageURL };
        const res = await axiosPublic.post("/addWork", workInfo);
        if (res?.data?.insertedId) {
            reset();
            refetch();
            toast.success("Your work successfully published")
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EAB308",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosPublic.delete(`/deleteWork/${id}`);
                if (res?.data?.deletedCount) {
                    refetch();
                    toast.success("Your file has been deleted.")
                }
            }
        });
    }

    if (isWork) {
        return <Loading />
    }

    return (
        <PrivateRoute>
            <div onClick={() => setOpenModal2(true)} className='flex justify-center mt-8'><button className='flex items-center font-medium bg-gradient-to-t from-[#EA580C] to-[#EAB308] text-white px-3 hover:scale-105 transition duration-300 py-1 rounded-md'>
                <FiPlus />
                <h1>Add Work</h1>
            </button></div>
            <div onClick={() => setOpenModal2(false)} className={`fixed z-[100] flex items-center justify-center ${openModal2 ? 'opacity-1 visible' : 'invisible opacity-0'} inset-0 bg-black/20 backdrop-blur-sm duration-100`}>
                <div onClick={(e_) => e_.stopPropagation()} className={`absolute max-h-[95vh] overflow-y-auto md:w-[600px] lg:w-[800px] rounded-lg bg-white mx-4 p-6 text-center drop-shadow-2xl dark:bg-gray-800 dark:text-white ${openModal2 ? 'opacity-1 translate-y-0 duration-300' : 'translate-y-20 opacity-0 duration-150'}`}>
                    <div className='flex gap-2'>
                        <svg onClick={() => setOpenModal2(false)} className="mx-auto mr-0 w-8 cursor-pointer absolute right-2 top-2 fill-black dark:fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path></g></svg>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className='w-full'>
                            <form className='flex flex-col gap-4 mx-auto mt-6 px-6' onSubmit={handleSubmit(onSubmit)}>
                                <h1 className='font-semibold text-2xl my-2 mt-4 md:mt-8'>Work details</h1>
                                <input {...register("title", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Enter Work Title..." />
                                {errors.title?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">Title is required</p>
                                )}
                                <input {...register("heading", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Enter Work Heading..." />
                                {errors.heading?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">Heading is required</p>
                                )}
                                <input {...register("keyword", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Enter Keywords..." />
                                {errors.keyword?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">Keyword is required</p>
                                )}
                                <select {...register("category")} className="select select-bordered w-full flex-1">
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="E-Commerce">E-Commerce</option>
                                    <option value="Digital Transformation">Digital Transformation</option>
                                    <option value="Content Management">Content Management</option>
                                    <option value="Experience Design">Experience Design</option>
                                    <option value="Data Strategy">Data Strategy</option>
                                    <option value="Product Information Management">Product Information Management</option>
                                    <option value="Strategy and Organization">Strategy and Organization</option>
                                    <option value="Experience Design">Experience Design</option>
                                </select>
                                {errors.category?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">Category is required</p>
                                )}
                                <textarea {...register("aboutTheProject", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='Enter details about this project...' />
                                {errors.description?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">This field is required</ p>
                                )}
                                <textarea {...register("ourSolution", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='Enter details about our solution...' />
                                {errors.ourSolution?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">This field is required</ p>
                                )}
                                <textarea {...register("theResults", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='Enter details about the results...' />
                                {errors.theResults?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">This field is required</ p>
                                )}
                                <input {...register("photo", { required: true })} className="file-input file-input-bordered w-full" id='photo' type="file" />
                                {errors.photo?.type === "required" && (
                                    <p className="text-red-600 text-left pt-1">Photo is required.</p>
                                )}
                                <input type='submit' className='block w-full font-bold bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white py-4 mx-auto mt-5 rounded-3xl shadow-lg shadow-[#85BDD7E0]/80 border-0 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#85BDD7E0]/80 active:scale-95 active:shadow-md active:shadow-[#85BDD7E0]/80' />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className='text-center text-2xl font-bold mt-6 md:mt-12'>All Works</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-6 lg:px-12 mt-4 mb-12'>
                {allWork?.map((work, index) => <div key={index}>
                    <div className="mx-auto space-y-6 rounded-xl bg-white px-8 pb-8 pt-4 font-sans shadow-lg dark:bg-[#18181B]">
                        <div className="relative flex h-48 w-full justify-center lg:h-[280px]">
                            <Image width={300} height={300} className="object-cover h-full w-full rounded-lg bg-black/40" src={work?.imageURL} alt="card" />
                        </div>
                        <div className="mx-auto w-[85%] space-y-2 text-center font-semibold">
                            <h6 className="text-sm font-bold md:text-base lg:text-lg">{work?.title}</h6>
                            <p className="text-xs font-medium text-gray-400 md:text-sm">{work?.heading}</p>
                            <div className='flex'><p className="mt-4 text-xs px-2 py-1 rounded-lg bg-gray-300 font-medium text-white md:text-sm">{work?.category}</p></div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 text-sm md:text-base">
                            <button onClick={() => handleDelete(work?._id)} className="rounded bg-gradient-to-t from-[#EA580C] to-[#EAB308] px-2 py-1 lg:px-5 lg:py-1.5 font-medium text-white duration-300 hover:scale-105 hover:bg-red-800 text-xs lg:text-sm flex gap-2 justify-center items-center">Delete <MdOutlineDelete className='text-xl' /></button>
                            <Link href={`/dashboard/update/${work?._id}`}><button className="gradient-text border lg:py-1.5 px-2 py-1 lg:px-5 rounded border-[#EAB308]  text-xs lg:text-sm hover:scale-105 duration-300 font-medium flex gap-2 justify-center items-center">Update <FaRegEdit className='text-lg text-[#EAB308]' /></button></Link>
                            <button onClick={() => open(work?._id)} className="hover:text-[#EA580C]"><FaEye /></button>
                            <div className={`fixed z-[100] flex items-center justify-center ${openModal ? 'opacity-1 visible' : 'invisible opacity-0'} inset-0 bg-black/20 backdrop-blur-sm duration-100`}>
                                <div className={`absolute max-w-screen-md max-h-[95vh] overflow-y-auto rounded-lg bg-white mx-4 md:mx-0 p-3 pb-5 text-center drop-shadow-2xl dark:bg-gray-800 dark:text-white ${openModal ? 'scale-1 opacity-1 duration-300' : 'scale-0 opacity-0 duration-150'} `}>
                                    <svg onClick={() => setOpenModal(false)} className="mx-auto mr-0 w-8 cursor-pointer fill-black dark:fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path></g></svg>
                                    <div className='flex justify-center items-center mt-6'>
                                        <Image src={details?.imageURL} alt='image' width={300} height={300} />
                                    </div>
                                    <div className="text-base px-8 font-black text-center mt-6">
                                        {details?.title}
                                    </div>
                                    <p className="mt-4 px-8 text-sm text-center font-medium">
                                        {details?.heading}
                                    </p>
                                    <p className="mt-4 px-8 text-sm text-center font-bold">
                                        Keywords :  {details?.keyword}
                                    </p>
                                    <div className='flex justify-center py-3'><p className="text-xs px-2 py-1 rounded-lg bg-gray-300 font-medium text-white md:text-sm">{details?.category}</p></div>
                                    <p className="mt-4 text-sm text-center">
                                        <h1 className='gradient-text font-bold py-1'>About The Project</h1>
                                        <p className='text-neutral-400 px-8'>{details?.aboutTheProject}</p>
                                    </p>
                                    <p className="mt-4 text-sm text-center">
                                        <h1 className='gradient-text font-bold py-1'>Our Solution</h1>
                                        <p className='text-neutral-400 px-8'>{details?.ourSolution}</p>
                                    </p>
                                    <p className="mt-4 text-sm text-center">
                                        <h1 className='gradient-text font-bold py-1'>The Results</h1>
                                        <p className='text-neutral-400 px-8'>{details?.theResults}</p>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </PrivateRoute>
    );
};

export default AllWork;