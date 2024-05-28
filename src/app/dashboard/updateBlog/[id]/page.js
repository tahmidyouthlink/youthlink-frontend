"use client";
import Loading from '@/components/shared/Loading/Loading';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import PrivateRoute from '@/utils/Provider/PrivateRoute';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ImCross } from 'react-icons/im';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import useBlogs from '@/hooks/useBlogs';

const Editor = dynamic(() => import('@/utils/Markdown/Editor/Editor'), { ssr: false });

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const UpdateBlog = ({ params }) => {
    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm();
    const [, , refetch] = useBlogs();
    const axiosPublic = useAxiosPublic();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});

    useEffect(() => {
        const fetchBlog = async () => {
            const res = await axiosPublic.get(`/allBlog/${params?.id}`);
            const blog = res.data;
            setDetails(blog);
            setValue('title', blog.title);
            setValue('keyword', blog.keyword);
            setValue('category', blog.category);
            setValue('description', blog.description);
            setValue('photo', blog.photo);
            setLoading(false);
        };
        fetchBlog();
    }, [params, axiosPublic, setValue]);

    const onSubmit = async (data) => {
        const title = data.title;
        const keyword = data.keyword;
        const category = data.category;
        const description = data.description;
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
        const updatedBlogInfo = { title, keyword, category, description, imageURL };
        const res = await axiosPublic.put(`/allBlog/${params?.id}`, updatedBlogInfo);
        if (res.data.modifiedCount > 0) {
            reset();
            refetch();
            toast.success("Blog updated successfully");
            router.push("/dashboard/allBlog");
        } else {
            toast.error("Change something first!");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <PrivateRoute>
            <div>
                <div className='fixed right-2 top-2'>
                    <Link href={'/dashboard/allBlog'}>
                        <ImCross className='hover:scale-105' size={20} />
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                    <div className='w-full'>
                        <form className='flex flex-col max-w-screen-md gap-4 mx-auto mt-6 px-6' onSubmit={handleSubmit(onSubmit)}>
                            <h1 className='font-semibold text-2xl my-2 mt-4 md:mt-8'>Update Blog details</h1>
                            <label htmlFor='title' className='flex justify-start font-medium text-[#EA580C]'>Edit Title</label>
                            <input id='title' {...register("title", { required: true })} className="w-full p-3 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" />
                            {errors.title?.type === "required" && (
                                <p className="text-red-600 text-left pt-1">Title is required</p>
                            )}
                            <label htmlFor='keyword' className='flex justify-start font-medium text-[#EA580C]'>Edit Keywords</label>
                            <input {...register("keyword", { required: true })} className="w-full p-3 mb-4 border rounded-md bg-gradient-to-r from-white to-gray-50" type="text" />
                            {errors.keyword?.type === "required" && (
                                <p className="text-red-600 text-left pt-1">Keyword is required</p>
                            )}
                            <label htmlFor='category' className='flex justify-start font-medium text-[#EA580C]'>Change Category</label>
                            <select id='category' {...register("category")} className="select select-bordered w-full flex-1 mb-3">
                                <option value="Industry News and Trends">Industry News and Trends</option>
                                <option value="How-To Guides and Tutorials">How-To Guides and Tutorials</option>
                                <option value="Case Studies and Success Stories">Case Studies and Success Stories</option>
                                <option value="Product and Service Reviews">Product and Service Reviews</option>
                                <option value="Expert Insights and Opinions">Expert Insights and Opinions</option>
                                <option value="Company News and Updates">Company News and Updates</option>
                                <option value="Security Tips and Best Practices">Security Tips and Best Practices</option>
                                <option value="Career Advice and Job Search Tips">Career Advice and Job Search Tips</option>
                                <option value="Client Testimonials and Feedback">Client Testimonials and Feedback</option>
                                <option value="Technology Explainers">Technology Explainers</option>
                                <option value="Event Coverage">Event Coverage</option>
                                <option value="Interviews with Experts">Interviews with Experts</option>
                                <option value="Future of IT">Future of IT</option>
                            </select>
                            {errors.category?.type === "required" && (
                                <p className="text-red-600 text-left pt-1">Category is required</p>
                            )}
                            <label htmlFor='description' className='flex justify-start font-medium text-[#EA580C]'>Edit Details About This Blog</label>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
                            />
                            {errors.description?.type === "required" && (
                                <p className="text-red-600 text-left pt-1">This field is required</p>
                            )}
                            {/* Display the current image */}
                            {details?.imageURL && (
                                <div className="mb-4">
                                    <Image height={300} width={300} src={details.imageURL} alt="Current" className="w-full max-w-xs mx-auto" />
                                </div>
                            )}

                            <label htmlFor='photo' className='flex justify-start font-medium text-[#EA580C]'>Change Blog Photo</label>
                            <input id='photo' {...register("photo")} className="file-input file-input-bordered w-full" type="file" />
                            {errors.photo?.type === "required" && (
                                <p className="text-red-600 text-left pt-1">Photo is required.</p>
                            )}
                            <input type='submit' value="Update" className='block w-full font-bold bg-gradient-to-t from-[#EA580C] to-[#EAB308] text-white py-4 mx-auto mt-5 rounded-3xl shadow-lg shadow-[#EA580C]/80 border-0 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#EA580C]/80 active:scale-95 active:shadow-md active:shadow-[#EA580C]/80' />
                        </form>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default UpdateBlog;