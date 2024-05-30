"use client";
import ApexCharts from 'apexcharts'
import { useEffect, useState } from 'react';
import { SiPoly } from 'react-icons/si';
import { RiLoaderFill, RiVerifiedBadgeFill } from 'react-icons/ri';
import Loading from '@/components/shared/Loading/Loading';
import useJobs from '@/hooks/useJobs';
import useCheckedJobCircular from '@/hooks/useCheckedJobCircular';
import useReviewCareer from '@/hooks/useReviewCareer';

const CareerStat = () => {

    const [allJob, isJob] = useJobs();
    const [checkedJobCircular, isCheckedJobCircular] = useCheckedJobCircular();
    const [reviewJobCircular, isReviewJobCircular] = useReviewCareer();

    const allJobLength = allJob?.length;
    const approvedLength = checkedJobCircular?.length;
    const underReviewLength = reviewJobCircular?.length;
    const taskCompletedPercentage = (approvedLength / allJobLength * 100).toFixed(2);

    useEffect(() => {
        if (allJob && checkedJobCircular && reviewJobCircular) {
            const options = {
                series: [taskCompletedPercentage],
                chart: {
                    height: 350,
                    type: 'radialBar',
                    offsetY: -10
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: '16px',
                                color: undefined,
                                offsetY: 120
                            },
                            value: {
                                offsetY: 76,
                                fontSize: '22px',
                                color: "#000",
                                formatter: function (val) {
                                    return val + "%";
                                }
                            }
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        shadeIntensity: 0.15,
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 65, 91]
                    },
                },
                stroke: {
                    dashArray: 4
                },
                labels: ['Approved Circular'],
            };

            const chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

            // Cleanup function
            return () => {
                chart.destroy();
            };
        }
    }, [allJob, checkedJobCircular, reviewJobCircular, taskCompletedPercentage]);

    if (isJob || isCheckedJobCircular || isReviewJobCircular) {
        return <Loading />
    }

    return (
        <div className='border rounded-lg px-6 mt-8 md:mt-12 xl:mt-16 max-w-screen-md mx-auto'>
            <div className='flex flex-col justify-center items-center md:flex-row gap-6 lg:gap-12 p-8'>
                <div className='space-y-2'>
                    <h1 className='text-xl'>Work Details</h1>
                    <div className='flex justify-start items-center gap-2 text-sm font-medium pt-4 pb-2'>
                        <SiPoly size={26} className="text-3xl text-blue-400  " />
                        <div className='flex flex-col justify-center items-start'>
                            <p>Total Works</p>
                            <h1>{allJobLength}</h1>
                        </div>
                    </div>
                    <div className='flex justify-start items-center gap-2 text-sm font-medium pb-2'>
                        <RiVerifiedBadgeFill size={26} className="text-3xl text-orange-500" />
                        <div className='flex flex-col justify-center items-start'>
                            <p>Approved Works</p>
                            <h1>{approvedLength}</h1>
                        </div>
                    </div>
                    <div className='flex justify-start items-center gap-2 text-sm font-medium'>
                        <RiLoaderFill size={26} className="text-3xl text-green-500 0 6s animate-spin" />
                        <div className='flex flex-col justify-center items-start'>
                            <p>Under Review Work</p>
                            <h1>{underReviewLength}</h1>
                        </div>
                    </div>
                </div>
                <div id="chart"></div>
            </div>
        </div>
    );
};

export default CareerStat;