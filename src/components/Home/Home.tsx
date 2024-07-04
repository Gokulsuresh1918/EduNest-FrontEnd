"use client";
import Cookie from "js-cookie";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Joyride from "react-joyride"; // Import Joyride
import imageUrl from "../../../public/images/bg.svg";
import landingGroup from "../../../public/images/landing-group.svg";
import landingGroup2 from "../../../public/images/landing-group2.svg";
import aiphoto from "../../../public/images/file.png";
import imageUrllight from "../../../public/images/milad-fakurian-UiiHVEyxtyA-unsplash.jpg";
import Footer from "../Footer/footer";
import { CreateClass } from "../Modal/CreateClass";
import { JoinClass } from "../Modal/JoinClass";
import { SparklesCore } from "../Ui/sparkles";
import Nav from "./Navbar";

const Home = () => {
  const [login, setLogin] = useState(false);
  const router = useRouter();

  const checkToken = async () => {
    const token = Cookie.get("token");
    if (!token) {
      router.push("/login");
    } else {
      setLogin(true);
    }
  };

  function checkLogin() {
    if (!login) {
      checkToken();
      return;
    }
  }

  const { theme, setTheme } = useTheme();

  // Initialize and configure the tour steps in the component state
  const [tourSteps, setTourSteps] = useState([
    {
      target: ".tour-step-1",
      content: "Welcome to the Edunest landing page!",
    },
    {
      target: ".tour-step-2",
      content:
        "Join a classroom easily from here and Create your own classroom here. using the unique code provided by your classroom creator.",
    },
    {
      target: ".tour-step-3",
      content: "Don’t forget to check out our premium features!",
    },
    {
      target: ".tour-step-4",
      content: "You Personal AI Tutor is here",
    },
    {
      target: ".tour-step-classrooms",
      content: "Here you can access all classrooms.",
    },
    {
      target: ".tour-step-theme",
      content: "Use this button to switch between light and dark modes.",
    },
  ]);

  // State to control Joyride
  const [runTour, setRunTour] = useState(true);

  // Check if the tour has been shown before
  useEffect(() => {
    const isTourShown = localStorage.getItem("isTourShown");
    if (!isTourShown) {
      setRunTour(true);
      localStorage.setItem("isTourShown", "true");
    }
  }, []);

  return (
    <div>
      <Nav className="tour-step-1" />
      {runTour && (
        <Joyride
          steps={tourSteps}
          continuous
          showProgress
          showSkipButton
          run={runTour} // Ensure the tour runs on load
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      )}
      {theme == "dark" ? (
        <Image
          src={imageUrl}
          alt="Login image"
          className="absolute object-fill -z-10 w-full"
        />
      ) : (
        <Image
          src={imageUrllight}
          alt="Login image"
          className="absolute object-fill -z-10 w-full"
        />
      )}
      <main className="items-center pt-36 justify-between flex flex-col space-y-28 ">
        {" "}
        {/* Added class for tour */}
        <div className="flex justify-between text-center">
          <div className="sm:h-[40rem] w-full flex-col items-center justify-center overflow-hidden rounded-md">
            <h1
              className={`sm:pt-48 ${
                theme === "dark" ? "text-white" : "text-black"
              } font-bold tracking-wider text-xl sm:text-6xl`}
            >
              New Era Of Learning
            </h1>
            <div className="w-[13rem] sm:w-[60rem] h-5 sm:h-80 relative">
              {/* Gradients */}
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
              <div className="absolute inset-0 h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>
        </div>
        <div className="w-[90%] flex justify-center text-white font-mono font-medium text-xs sm:text-lg">
          <p
            className={`tracking-wide ${
              theme === "dark" ? "text-white" : "text-black"
            } text-center`}
          >
            Welcome to EDUNEST. Empower educators and learners with seamless
            collaboration through doubt clearing, task management, and resource
            sharing. Teachers can effortlessly create virtual classrooms and
            conduct live classes. Our user-friendly interface and robust
            security measures ensure a smooth experience. Join us for a journey
            of discovery in online learning today.
          </p>
        </div>
        <div
          onClick={checkLogin}
          className="tour-step-2  flex justify-center space-x-4"
        >
          <JoinClass
            status={login}
            className=" px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          />
          <CreateClass
            status={login}
            className=" px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:bg-green-600"
          />
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-8">
          {/* Image Section */}
          <div className="hidden lg:block pl-9 w-full sm:w-[40%]">
            <Image
              src={aiphoto}
              alt="Classroom Creation Image"
              className="object-fill"
            />
          </div>

          {/* Text and Call-to-Action Section */}
          <div className="p-6 sm:p-16 w-full sm:w-[60%]">
            <h1 className="font-bold text-3xl sm:text-4xl font-serif mb-4">
              Your Personal AI Tutor
            </h1>
            <p className="text-sm mb-8">
              "Introducing our AI Personal Tutor—a revolutionary feature
              designed to enhance learning with intelligent, personalized
              guidance. Seamlessly interact, receive tailored explanations, and
              optimize your learning journey effortlessly. Elevate your
              education with cutting-edge AI technology, ensuring every question
              finds its expert answer.".
            </p>

            {/* Call-to-action button or link */}
            <Link href="/qatutor">
              <button className="relative inline-flex items-center justify-center bg-slate-800 no-underline group cursor-pointer shadow-2xl shadow-zinc-900 rounded-full p-2 text-sm font-semibold leading-6 text-white transition-transform duration-300 transform hover:scale-110">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="tour-step-4 relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-6 ring-1 ring-white/10">
                  <span>Try Personal Tutor</span>
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute bottom-0 left-1.125rem h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-8">
          {/* Image Section */}

          {/* Text and Call-to-Action Section */}
          <div className="p-6 sm:p-16 w-full sm:w-[60%]">
            <h1 className="font-bold text-3xl sm:text-4xl font-serif mb-4">
              Todo Records
            </h1>
            <p className="text-sm mb-8">
              Empower your teaching with our easy-to-use tools. Create a virtual
              classroom, manage tasks, share resources, and conduct live
              sessions to enhance your students' learning journey also
              integrated quiz platform todo platform all are integrated for
              continuous learing
            </p>

            <Link href="/qatutor">
              <button className="p-[3px] relative">
                <div className="absolute  rounded-xl inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 " />
                <div className="px-8 py-2  bg-slate-900  rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  Try Todo
                </div>
              </button>
            </Link>
          </div>
          <div className="hidden lg:block pl-9 w-full sm:w-[40%]">
            <Image
              src={landingGroup2}
              alt="Login image"
              className="object-cover -z-10 w-full h-auto"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-8">
          {/* Image Section */}
          <div className="hidden lg:block pl-9 w-full sm:w-[40%]">
            <Image
              src={landingGroup}
              alt="Login image"
              className="object-cover -z-10 w-full h-auto"
            />
          </div>
          {/* Text and Call-to-Action Section */}
          <div className="p-6 sm:p-16 w-full sm:w-[60%]">
            <h1 className="font-bold text-3xl sm:text-4xl font-serif mb-4">
              Quiz Time
            </h1>
            <p className="text-sm mb-8">
              Effortlessly join your classroom with the unique code provided by
              your educator. Collaborate with peers, participate in discussions,
              and access all the resources you need for an engaging learning
              experience.
            </p>

            <Link href="/qatutor">
              <button className="p-[3px] relative">
                <div className="absolute  rounded-xl inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 " />
                <div className="px-8 py-2  bg-slate-900  rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  Try Quiz
                </div>
              </button>
            </Link>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-md text-center ">
          <h1 className="font-bold text-2xl sm:text-5xl mb-4">
            Upgrade to Premium
          </h1>
          <h3 className="text-xs sm:text-sm md:text-base text-center px-10 text-gray-400">
            Unlock exclusive features and elevate your learning experience with
            Edunest Premium. Our premium subscription maximizes productivity for
            both educators and learners, providing advanced tools and
            personalized benefits. Enjoy enhanced collaboration tools to create
            and manage multiple virtual classrooms seamlessly. Conduct live
            sessions with premium video conferencing, and offer real-time
            feedback. Access advanced analytics and reporting tools to track
            student progress comprehensively. Students gain access to a vast
            library of premium content, including exclusive study materials,
            practice tests, and interactive modules. Personalized learning paths
            help students achieve their academic goals efficiently. Experience
            an ad-free platform, ensuring uninterrupted focus on educational
            activities. Benefit from robust security measures and dedicated
            customer support for a smooth, secure experience. Subscribe to
            Edunest Premium today and unlock the full potential of our platform.
            Elevate your teaching and learning experience to new heights with
            our comprehensive premium features.
          </h3>
          <Link href={"/subscription"}>
            <button className="mt-10  transition-transform duration-300 transform hover:scale-110 tour-step-3 relative inline-flex h-16 overflow-hidden rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span
                className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-lg font-medium text-white backdrop-blur-3xl
   "
              >
                Subscribe Now
              </span>
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
