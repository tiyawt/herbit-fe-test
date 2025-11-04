// app/settings/fetchProfile.js
import { cookies } from "next/headers";
import axios from "axios";
import { normalizePhotos } from "@/lib/absoluteUrl";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                process.env.NEXT_PUBLIC_API_URL || 
                "https://herbit-be-test.vercel.app/api";

export async function fetchProfile() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = response.data?.data ?? response.data ?? null;
    return normalizePhotos(data);
  } catch (error) {
    console.error("Failed to load profile data", error);
    return null;
  }
}
