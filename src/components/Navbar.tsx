"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup"); // Redirect to your sign up page
  };

  const defaultProfileImage = "/profile.jpg"; // Path to your default avatar image

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href={"/"} className="text-xl font-bold">Task Manager</Link>
      {session ? (
        <div className="flex items-center gap-3">
          {/* Profile Image with hover effect */}
          <div className="relative">
            <img
              src={session.user.image || defaultProfileImage} // Show default image if no profile image
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="absolute bottom-0 left-0 right-0 text-xs text-center bg-gray-900 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
              {session.user.name}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Sign In Button */}
          <button
            onClick={() => signIn()}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Sign In
          </button>
          {/* Sign Up Button */}
          <button
            onClick={handleSignUp} // Trigger the handleSignUp function
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
