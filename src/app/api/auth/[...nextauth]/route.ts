import NextAuth, { NextAuthOptions, Session} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),

    // Email/Password Authentication (SignUp + SignIn)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }, // Add name for signup
      },
      // Inside your CredentialsProvider
      async authorize(credentials) {
        if (credentials?.name && credentials?.email && credentials?.password) {
        // This is the sign-up flow
        await connectDB();
    
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email: credentials.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
    
        // Hash password before saving
        const hashedPassword = bcrypt.hashSync(credentials.password, 10);
    
        // Create new user
        const newUser = new UserModel({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
        });
    
        await newUser.save();
    
        // Return the user data after signup (this is crucial)
        return {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            image: newUser.image || null,
        };
        }
    
        // If this is a login flow
        if (credentials?.email && credentials?.password) {
        await connectDB();
    
        const user = await UserModel.findOne({ email: credentials.email });
    
        if (!user) {
            throw new Error("User not found");
        }
    
        const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
    
        // Return the user data after login (this is also crucial)
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
        };
        }
    
        return null;
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // This callback updates the JWT token when user logs in or signs up
    async jwt({ token, user }) {
        if (user) {
          console.log("User logged in or signed up:", user);  // Log the user object
          token.id = user.id;
          token.email = user.email as string;
          token.name = user.name as string;
          token.image = user.image || null;
        }
        console.log("JWT Token:", token);  // Log the JWT token after updating
        return token;
    },
      

    // This callback updates the session when JWT token changes (after login or signup)
    async session({ session, token }: { session: Session; token: JWT }) {
        console.log("Session before update:", session);  // Log the session before update
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.image as string | null;
        }
        console.log("Session after update:", session);  // Log the session after update
        return session;
    }
      
  },

  pages: {
    signIn: "/signin", // Custom sign-in page URL
    signOut: "/", // Redirect to homepage on sign-out
    error: "/signin", // Redirect to sign-in page on error
  },

  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { connectDB } from "@/lib/mongodb";
// import UserModel from "@/models/User";
// import bcrypt from "bcryptjs";
// import { JWT } from "next-auth/jwt";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     // Google Authentication
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
//     }),

//     // Email/Password Authentication
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }

//         await connectDB();
//         const user = await UserModel.findOne({ email: credentials.email });

//         if (!user) {
//           throw new Error("User not found");
//         }

//         const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
//         if (!isValidPassword) {
//           throw new Error("Invalid credentials");
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           image: user.image || null, // Ensure image is also passed
//         } as User;
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },

//   // Callback to handle token creation
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email as string;
//         token.name = user.name as string;
//         token.image = user.image || null; // Ensure image is included in the token
//       }
//       return token;
//     },

//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//         session.user.image = token.image as string | null; // Include image in session
//       }
//       return session;
//     },

//     // Handle Google SignIn
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         await connectDB();
        
//         // Check if the user already exists based on email
//         let existingUser = await UserModel.findOne({ email: user?.email });

//         // If the user doesn't exist, create a new one
//         if (!existingUser) {
//           const newUser = new UserModel({
//             name: user?.name,
//             email: user?.email,
//             image: user?.image, // Image from Google account
//             password: "", // No password for Google login
//           });

//           await newUser.save();
//         }
//       }
//       return true; // Allow the sign-in to proceed
//     },
//   },

//   // Pages customization
//   pages: {
//     signIn: "/signin", // Custom sign-in page URL
//     signOut: "/", // Redirect to homepage on sign out
//     error: "/signin", // Redirect to sign-in page on error
//   },

//   // Secret used for JWT encoding and decoding
//   secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
