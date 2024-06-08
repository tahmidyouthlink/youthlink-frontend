// import React, { useState } from 'react';
import Loading from '@/components/shared/Loading/Loading';
import Image from 'next/image';
import PrivateRoute from '@/utils/Provider/PrivateRoute';
import useWorks from '@/hooks/useWorks';

const WorkTable = () => {
    const [allWork, isWork] = useWorks();
    // const [showMoreData, setShowMoreData] = useState(7);

    // const toggleShowMore = () => {
    //     if (showMoreData === 7) {
    //         setShowMoreData(allWork?.length);
    //     } else if (showMoreData > 7) {
    //         setShowMoreData(7);
    //     }
    // };

    if (isWork) {
        return <Loading />;
    }

    return (
        <PrivateRoute>
            {allWork?.length > 0 ? <div>
                <h1 className='mt-8 my-4 px-10 font-semibold'>Our Works</h1>
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Thumbnail / Title</th>
                                    <th>Category</th>
                                    <th>Keywords</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {/* {allWork?.slice(0, showMoreData).map((work, index) => ( */}
                                {allWork?.map((work, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <Image src={work?.imageURL} alt='image' height={100} width={200} />
                                                    </div>
                                                </div>
                                                <div className="font-bold">{work?.title}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="px-4 py-1 text-[10px] md:text-xs lg:text-base bg-gray-200 rounded-lg">{work?.category}</span>
                                        </td>
                                        <td>{work?.keyword?.map((skill, index) => <p key={index} className={`text-neutral-400`}>{skill?.value}</p>)}</td>
                                        <td>{work?.status === "checked" ? <span className='text-blue-700 font-bold'>Approved</span> : <span className='text-red-700 font-bold'>Under Review</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* {allWork?.length > 7 && (
                    <div onClick={toggleShowMore} className="my-6 md:my-8 px-6 flex justify-center">
                        <button className="font-medium bg-gradient-to-r from-[#EA580C] to-[#EAB308] text-white py-2 px-4 rounded-lg mx-auto hover:bg-gradient-to-t hover:from-[#EAB308] hover:to-[#EA580C]">{showMoreData > 7 ? 'Show less' : 'Show More'}</button>
                    </div>
                )} */}
            </div> : <div>
                <h1 className='mt-8 my-4 px-10 font-semibold'>Our Work</h1>
                <h1 className='text-center my-8'>There is no works</h1>
            </div>}
        </PrivateRoute>
    );
};

export default WorkTable;