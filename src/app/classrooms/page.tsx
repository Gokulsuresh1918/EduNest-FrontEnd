
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Nav from '@/components/Home/Navbar';
import { GlareCard } from '@/components/Ui/glare-card';
import Image from 'next/image';
import Router, { useRouter } from 'next/navigation';

interface ClassroomDetail {
  classroom: any;
  id: string;
  title: string;
  description: string;
  owner: string;
  profilePicture: string;
  roomCode: string;
  status: boolean;
  teacherCode: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const clentUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

const Classrooms = () => {
  const [toggleSelection, setToggleSelection] = useState(false);
  const [createdClassrooms, setCreatedClassrooms] = useState<string[]>([]);
  const [joinedClassrooms, setJoinedClassrooms] = useState<string[]>([]);
  const [joinedClassDetails, setJoinedClassDetails] = useState<ClassroomDetail[]>([]);
  const [createdClassDetails, setCreatedClassDetails] = useState<ClassroomDetail[]>([]);

  const router=useRouter()
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userJson = localStorage.getItem('User');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          const userId = user?._id;

          if (userId) {
            const response = await axios.get(`${BASE_URL}/user/userData`, {
              params: { id: userId },
            });

            setCreatedClassrooms(response.data.createdClassrooms || []);
            setJoinedClassrooms(response.data.joinedClassrooms || []);
          } else {
            toast.error('User ID not found, try logging in.');
          }
        } catch (error) {
          console.error('Error parsing user data or fetching details:', error);
          toast.error('Failed to fetch user details.');
        }
      } else {
        toast.error('Please log in. No user data found.');
        console.log('No user data found in localStorage.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchCreatedClassroomData = async () => {
      try {
        const promises = createdClassrooms.map(async (classroomId) => {
          const response = await axios.get<ClassroomDetail>(
            `${BASE_URL}/class/classDetails/${classroomId}`
          );
          return response.data;
        });

        const createdClassroomData = await Promise.all(promises);
        setCreatedClassDetails(createdClassroomData);
      } catch (error) {
        console.error('Error fetching created classrooms:', error);
        toast.error('Failed to fetch created classrooms.');
      }
    };

    if (createdClassrooms.length > 0) {
      fetchCreatedClassroomData();
    }
  }, [createdClassrooms]);

  useEffect(() => {
    const fetchJoinedClassroomData = async () => {
      try {
        const promises = joinedClassrooms.map(async (classroomId) => {
          const response = await axios.get<ClassroomDetail>(
            `${BASE_URL}/class/classDetails/${classroomId}`
          );
          return response.data;
        });

        const joinedClassroomData = await Promise.all(promises);
        setJoinedClassDetails(joinedClassroomData);
      } catch (error) {
        console.error('Error fetching joined classrooms:', error);
        toast.error('Failed to fetch joined classrooms.');
      }
    };

    if (joinedClassrooms.length > 0) {
      fetchJoinedClassroomData();
    }
  }, [joinedClassrooms]);

  const handleSelection = () => {
    setToggleSelection(true);
  };

  const handleSelectioncre = () => {
    setToggleSelection(false);
  };

  // Click handler for GlareCard
  const handlejoinClickCard = (classroomId: string) => {
    // console.log('joined',classroomId);
    
    router.push(`${clentUrl}/createdClass/${classroomId}`)
    };
  const handlecreateClickCard = (classroomId: string) => {
    // console.log('joined',classroomId);

    router.push(`${clentUrl}/joinedClass/${classroomId}`)
  };

  return (
    <>
      <div className="flex flex-col h-screen gap-16 sm:gap-24">
        <nav className="w-full">
          <Nav />
        </nav>

        <main className="flex-grow p-4 flex flex-col items-center">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleSelection}
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-xl border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Joined
            </button>
            <button
              onClick={handleSelectioncre}
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-xl border border-slate-700 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Created
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {toggleSelection && joinedClassDetails.length > 0 ? (
              joinedClassDetails.map((item, index) => (
                <div
                  key={item.classroom?.id}
                  className="cursor-pointer"
                  onClick={() => handlejoinClickCard(item.classroom.roomCode)}
                >
                  <GlareCard
                    className="relative flex flex-col items-start justify-end py-8 px-6"
                  >
                    <Image
                      className="h-full w-full absolute inset-0 object-fill"
                      src={item.classroom?.profilePicture}
                      alt="Classroom Image"
                      width={500} // Provide width here
                      height={500} // Provide height here
                    />
                    <div className="relative z-10">
                      <p className="font-bold font-serif text-white text-xl">
                        {item.classroom?.title}
                      </p>
                      <p className="font-normal text-base text-neutral-200 mt-4">
                        {item.classroom?.description}
                      </p>
                    </div>
                  </GlareCard>
                </div>
              ))
            ) : !toggleSelection && createdClassDetails.length > 0 ? (
              createdClassDetails.map((item, index) => (
                <div
                  key={item.classroom?.id}
                  className="cursor-pointer"
                  onClick={() => handlecreateClickCard(item.classroom.roomCode)}
                >
                  <GlareCard
                    className="relative flex flex-col items-start justify-end py-8 px-6"
                  >
                    <Image
                      className="h-full w-full absolute inset-0 object-fill"
                      src={item.classroom?.profilePicture}
                      alt="Classroom Image"
                      width={500} // Provide width here
                      height={500} // Provide height here
                    />
                    <div className="relative z-10">
                      <p className="font-bold font-serif text-white text-xl">
                        {item.classroom?.title}
                      </p>
                      <p className="font-normal text-base text-neutral-200 mt-4">
                        {item.classroom?.description}
                      </p>
                    </div>
                  </GlareCard>
                </div>
              ))
            ) : (
              <p className="text-neutral-200">No classrooms to display</p>
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Classrooms;
