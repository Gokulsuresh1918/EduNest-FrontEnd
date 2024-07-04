
'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/Ui/button";
import { Input } from "@/components/Ui/input";
import { useTheme } from "next-themes";
import Nav from "@/components/Home/Navbar";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const QATutorPage = () => {
  const { theme } = useTheme();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [isSubscribed, setIsSubscribed] = useState(false); // State to track subscription status
  const Router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookie.get("token");
      if (!token) {
        Router.push('/login');
        return;
      }

      // Check user data in localStorage or wherever it's stored
      const userData = JSON.parse(localStorage.getItem("userData") || '{}');

      if ( userData.isSubscribed=='false') {
        Router.push('/subscription');
      }else if(!userData ){
        Router.push('/login');
      } else {
        setIsLoggedIn(true);
        setIsSubscribed(true); // Set subscription status based on userData.isSubscribed
      }
    };

    checkToken();
  }, [Router]);

  const handleQuestionSubmit = async () => {
    setLoading(true); // Set loading to true when submitting question
    try {
      const response = await axios.post(`${BASE_URL}/user/gemini`, { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error fetching answer. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after receiving answer or error
    }
  };

  if (!isLoggedIn) {
    return null; // Render nothing until login status is determined
  }

  return (
    <>
      {isSubscribed && <Nav />}

      {isSubscribed && (
        <div
          className={`min-h-screen mt-20 ${
            theme === "dark" ? "text-white" : "bg-white text-black"
          }`}
        >
          <main className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold font-serif text-center mb-4">
              Interactive Tutor
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className={`px-4 py-2 w-full rounded-md focus:outline-none ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-black"
                } border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              />
              <Button
                onClick={handleQuestionSubmit}
                disabled={loading} // Disable button while loading
                className={`bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {loading ? "Loading..." : "Ask"}{" "}
                {/* Show Loading text when loading */}
              </Button>
            </div>
            {answer && (
              <div
                className={`border rounded-md p-4 ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <h2 className="text-xl text-orange-300 font-bold mb-2">Answer:</h2>
                <p className="text-gray-300">{answer}</p>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default QATutorPage;
