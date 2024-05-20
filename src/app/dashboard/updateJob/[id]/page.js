"use client";
import Loading from '@/components/shared/Loading/Loading';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useJobs from '@/hooks/useJobs';
import PrivateRoute from '@/utils/Provider/PrivateRoute';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const UpdateJobPage = ({ params }) => {

    const [allJob, isJob, refetch] = useJobs();
    const [details, setDetails] = useState({});
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const router = useRouter();

    useEffect(() => {
        if (allJob) {
            const data = allJob.find(job => job._id == params?.id);
            setDetails(data);
        }
    }, [allJob, params]);

    useEffect(() => {
        if (details) {
            reset(details);
        }
    }, [details, reset]);

    const onSubmit = async (data) => {
        const title = data.title;
        const locationType = data.locationType;
        const overview = data.overview;
        const aboutTheRole = data.aboutTheRole;
        const skillsRequired = data.skillsRequired;
        const recruiter = data.recruiter;
        const recruiterRole = data.recruiterRole;
        const recruiterEmail = data.recruiterEmail;
        let imageURL = details.imageURL; // Default to current imageURL
        if (data.photo && data.photo[0]) {
            const photo = data.photo[0];
            const formData = new FormData();
            formData.append('image', photo);
            const uploadImage = await axiosPublic.post(apiURL, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                }
            });
            imageURL = uploadImage?.data?.data?.display_url;
        }
        const jobInfo = { title, locationType, overview, aboutTheRole, skillsRequired, recruiter, recruiterRole, recruiterEmail, imageURL };
        const res = await axiosPublic.put(`/allJobCircular/${details?._id}`, jobInfo);
        if (res?.data?.modifiedCount) {
            toast.success("Updated Successfully");
            refetch();
            router.push("/dashboard/allJob")
        }
        else {
            toast.error("Change something first!")
        }
    }

    if (isJob) {
        return <Loading />;
    }

    return (
        <PrivateRoute>
            <div>
                <form className='flex flex-col gap-4 max-w-screen-md mx-auto' onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='font-semibold text-2xl mt-4 md:mt-8'>Edit job details</h1>
                    <input defaultValue={details?.title} {...register("title", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Job Title" />
                    {errors.title?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Title is required</p>
                    )}
                    <input defaultValue={details?.locationType} {...register("locationType", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Location & Job Type" />
                    {errors.locationType?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Location & Job Type is required</p>
                    )}
                    <input defaultValue={details?.recruiter} {...register("recruiter", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Recruiter Name" />
                    {errors.recruiter?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Recruiter Name is required</p>
                    )}
                    <input defaultValue={details?.recruiterRole} {...register("recruiterRole", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" placeholder="Recruiter Role" />
                    {errors.recruiterRole?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Recruiter Role is required</p>
                    )}
                    <input defaultValue={details?.recruiterEmail} {...register("recruiterEmail", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="email" placeholder="Recruiter Email" />
                    {errors.recruiterEmail?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Recruiter Email is required</p>
                    )}
                    {/* Display the current image */}
                    {details?.imageURL && (
                        <div className="mb-4">
                            <Image height={300} width={300} src={details?.imageURL} alt="Current" className="w-full max-w-xs mx-auto" />
                        </div>
                    )}
                    <label htmlFor='photo'>Change Recruiter Photo *</label>
                    {/* File input for new photo */}
                    <input {...register("photo")} className="file-input file-input-bordered w-full" type="file" />
                    {errors.photo?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Photo is required.</p>
                    )}
                    <textarea defaultValue={details?.overview} {...register("overview", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='Opportunity Overview' />
                    {errors.overview?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Overview is required</ p>
                    )}
                    <textarea defaultValue={details?.aboutTheRole} {...register("aboutTheRole", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='About The Role' />
                    {errors.aboutTheRole?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">About The Role is required</ p>
                    )}
                    <textarea defaultValue={details?.skillsRequired} {...register("skillsRequired", { required: true })} className="w-full p-4 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" rows={4} placeholder='Skills Required' />
                    {errors.skillsRequired?.type === "required" && (
                        <p className="text-red-600 text-left pt-1">Skills is required</ p>
                    )}
                    <input type='submit' value="Update" className='block w-full font-bold bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white py-4 mx-auto mt-5 rounded-3xl shadow-lg shadow-[#85BDD7E0]/80 border-0 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#85BDD7E0]/80 active:scale-95 active:shadow-md active:shadow-[#85BDD7E0]/80' />
                </form>
            </div>
        </PrivateRoute>
    );
};

export default UpdateJobPage;