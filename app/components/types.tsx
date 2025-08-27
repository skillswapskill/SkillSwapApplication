export type User = {
  _id: string;        // Mongo ID
  name: string;
  clerkId: string;
  email: string;
  profilePic: string; // ✅ backend gives "profilePic"
  skills: string[];
  totalCredits?: number; // optional
};