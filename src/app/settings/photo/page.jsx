import PhotoClient from "./PhotoClient";
import { fetchProfile } from "../fetchProfile";
export const dynamic = 'force-dynamic'
export default async function PhotoSettingsPage() {
  const profile = await fetchProfile();
  return <PhotoClient user={profile} />;
}
