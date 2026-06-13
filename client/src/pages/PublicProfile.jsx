import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchFollowers,
  fetchFollowing,
  fetchMyProfile,
  fetchUserByUsername,
  followUser,
  unfollowUser,
} from "../services/userApi";
import { mapUserToProfile } from "../utils/profileUtils";
import ProfileAvatar from "../components/ProfileAvatar";
import Modal from "../components/Modal";

function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [listOpen, setListOpen] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      try {
        const user = await fetchUserByUsername(username);
        if (!active) return;

        if (token && currentUserId && user._id === currentUserId) {
          navigate("/profile", { replace: true });
          return;
        }

        const mapped = mapUserToProfile(user);
        setProfile(mapped);

        if (token) {
          try {
            const me = await fetchMyProfile();
            const isFollowing = (me.following || []).some(
              (id) => id.toString() === user._id.toString()
            );
            setFollowing(isFollowing);
          } catch {
            setFollowing(false);
          }
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || "User not found");
          navigate("/", { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [username, token, currentUserId, navigate]);

  const handleFollowToggle = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    if (!profile?.id) return;

    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(profile.id);
        setFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followerCount: Math.max(0, (prev.followerCount || 1) - 1),
        }));
        toast.success("Unfollowed");
      } else {
        await followUser(profile.id);
        setFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + 1,
        }));
        toast.success("Following");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  const openList = async (type) => {
    if (!profile?.id) return;
    setListOpen(type);
    try {
      if (type === "followers") {
        const data = await fetchFollowers(profile.id);
        setFollowers(data);
      } else {
        const data = await fetchFollowing(profile.id);
        setFollowingList(data);
      }
    } catch {
      toast.error(`Failed to load ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <p className="text-sm text-white/50">Loading profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const listData = listOpen === "followers" ? followers : followingList;
  const listTitle = listOpen === "followers" ? "Followers" : "Following";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-sm font-bold tracking-[0.22em] text-[#FF1E3C]">
            RESPAWN<span className="text-white">ID</span>
          </Link>
          {token ? (
            <Link to="/dashboard" className="text-xs text-white/50 hover:text-[#FF1E3C]">
              Dashboard
            </Link>
          ) : (
            <Link to="/signin" className="text-xs text-white/50 hover:text-[#FF1E3C]">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#151515]/85">
          <div className="relative h-36 sm:h-44">
            <img src={profile.banner} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent" />
          </div>
          <div className="relative px-5 pb-5">
            <ProfileAvatar name={profile.displayName} avatar={profile.avatar} />
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-bold sm:text-2xl">{profile.displayName}</h1>
                <p className="text-sm text-[#FF1E3C]">@{profile.username}</p>
                <p className="mt-2 max-w-xl text-sm text-white/55">{profile.bio || "No bio yet."}</p>
                <div className="mt-3 flex gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => openList("followers")}
                    className="text-white/45 hover:text-[#FF1E3C]"
                  >
                    <span className="font-semibold text-white">{profile.followerCount}</span> followers
                  </button>
                  <button
                    type="button"
                    onClick={() => openList("following")}
                    className="text-white/45 hover:text-[#FF1E3C]"
                  >
                    <span className="font-semibold text-white">{profile.followingCount}</span> following
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-70 ${
                  following
                    ? "border border-white/20 bg-white/5 text-white/70"
                    : "bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] text-white"
                }`}
              >
                {followLoading ? "..." : following ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </section>

        {profile.steamId && (
          <p className="text-center text-xs text-white/40">Steam connected</p>
        )}
      </main>

      <Modal open={Boolean(listOpen)} onClose={() => setListOpen(null)} title={listTitle}>
        {listData.length === 0 ? (
          <p className="text-sm text-white/45">No users yet.</p>
        ) : (
          <ul className="space-y-2">
            {listData.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setListOpen(null)}
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <ProfileAvatar
                    name={user.username}
                    avatar={user.avatar}
                    size="sm"
                  />
                  <span className="text-sm font-medium">@{user.username}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default PublicProfile;
