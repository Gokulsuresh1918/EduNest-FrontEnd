import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { userStore } from "../../../globalStore/store";
import Cookies from 'js-cookie';

const NavBar = () => {
  const user = userStore((state) => state.user);
  const [profile, setProfile] = useState(false);
  const Router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }
  }, [theme]);

  function handleProfile() {
    setProfile(!profile);
  }

  const onSignout = () => {
    // console.log('sign out confirmed');
    Cookies.remove('token', { path: '', secure: true, sameSite: 'strict' });
    localStorage.removeItem('User');
    Router.push('/adminLogin');
  };

  return (
    <>
      <div className="flex justify-between  h-16 w-full">
        <div className="flex justify-center items-center">
          <h1 className="md:block hidden m bg-amber-500  rounded-xl shadow-md px-5">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex justify-center items-center gap-4">
          <button
            className="outline-none"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </button>
          <h2 className=" hidden sm:block p-1 font-serif border-black rounded-xl shadow-2xl mr-2">
            {user?.name || "Guest"}
          </h2>
          <button onClick={onSignout} className="border px-4 py-1 rounded-2xl">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
