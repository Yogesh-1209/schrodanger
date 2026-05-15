import { useState } from "react";
import { toast } from "react-toastify";
import {
  achievements,
  games,
  gamingStats,
  getGameThumb,
  recentGames,
  topGenres,
  topGames,
} from "../data/dummyData";
import { useFavorites } from "../context/FavoritesContext";
import { useProfile } from "../context/ProfileContext";
import GameCard from "../components/GameCard";
import Modal from "../components/Modal";
import ProfileAvatar from "../components/ProfileAvatar";

function Profile() {
  const { profile, platforms, updateProfile, togglePlatform } = useProfile();
  const { favorites } = useFavorites();
  const [editOpen, setEditOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [draft, setDraft] = useState({
    displayName: profile.displayName,
    username: profile.username,
    bio: profile.bio,
    avatar: profile.avatar,
    banner: profile.banner,
  });

  const favoriteGames = games.filter((g) => favorites.includes(g.id));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(draft);
    setEditOpen(false);
    toast.success("Profile updated");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${profile.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch {
      toast.info(url);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="relative h-36 sm:h-44">
          <img src={profile.banner} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent" />
        </div>
        <div className="relative px-5 pb-5">
          <ProfileAvatar name={profile.displayName} />
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold sm:text-2xl">{profile.displayName}</h1>
              <p className="text-sm text-[#FF1E3C]">@{profile.username}</p>
              <p className="mt-2 max-w-xl text-sm text-white/55">{profile.bio}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    displayName: profile.displayName,
                    username: profile.username,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    banner: profile.banner,
                  });
                  setEditOpen(true);
                }}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:border-[#FF1E3C]/40"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] px-4 py-2 text-xs font-semibold"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Hours", value: `${profile.totalHours}h` },
          { label: "Achievements", value: profile.achievementCount },
          { label: "Games", value: profile.gamesOwned },
          { label: "Level", value: profile.level },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-white/40">{stat.label}</p>
            <p className="font-display mt-1 text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display mb-3 text-lg font-bold">Favorite Games</h2>
        {favoriteGames.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/45">No favorites yet — heart games in your library.</p>
        )}
      </section>

      <section>
        <h2 className="font-display mb-3 text-lg font-bold">Recently Played</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recentGames.map((game) => (
            <div key={game.id} className="min-w-[120px] shrink-0">
              <img
                src={game.cover}
                alt={game.title}
                loading="lazy"
                className="h-36 w-[100px] rounded-xl object-cover"
              />
              <p className="mt-1 truncate text-xs font-medium">{game.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Top Genres</h2>
          <ul className="space-y-3">
            {topGenres.map((g) => (
              <li key={g.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-white/45">{g.hours}h</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#FF1E3C]" style={{ width: `${g.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Gaming Stats</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-white/40">Avg Session</dt>
              <dd className="font-semibold">{gamingStats.avgSession}</dd>
            </div>
            <div>
              <dt className="text-white/40">Longest Streak</dt>
              <dd className="font-semibold">{gamingStats.longestStreak} days</dd>
            </div>
            <div>
              <dt className="text-white/40">Completion Rate</dt>
              <dd className="font-semibold">{gamingStats.completionRate}%</dd>
            </div>
            <div>
              <dt className="text-white/40">Multiplayer</dt>
              <dd className="font-semibold">{gamingStats.multiplayerRatio}%</dd>
            </div>
          </dl>
          <h3 className="font-display mt-6 mb-2 text-sm font-bold text-white/70">Top Played</h3>
          <ul className="space-y-2">
            {topGames.slice(0, 3).map((g) => (
              <li key={g.id} className="flex justify-between text-sm">
                <span>{g.title}</span>
                <span className="text-white/45">{g.hoursPlayed}h</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Top Achievements</h2>
          <button
            type="button"
            onClick={() => setConnectOpen(true)}
            className="text-xs text-[#FF1E3C] hover:text-white"
          >
            Connect platforms
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <span
              key={p.id}
              className={`rounded-full px-3 py-1 text-xs ${
                p.connected ? "bg-[#FF1E3C]/15 text-[#FF1E3C]" : "bg-white/5 text-white/35"
              }`}
            >
              {p.name}
            </span>
          ))}
        </div>
        <ul className="space-y-3">
          {achievements.slice(0, 4).map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-white/45">
                  {a.game} · {a.rarity}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form className="space-y-4" onSubmit={handleSaveProfile}>
          {[
            { name: "displayName", label: "Display Name" },
            { name: "username", label: "Username" },
            { name: "bio", label: "Bio", multiline: true },
            { name: "banner", label: "Banner URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-xs text-white/50">{field.label}</label>
              {field.multiline ? (
                <textarea
                  value={draft[field.name]}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
              ) : (
                <input
                  value={draft[field.name]}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] py-3 text-sm font-semibold"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect Platforms">
        <p className="mb-4 text-sm text-white/50">
          Link your accounts to sync libraries, achievements, and playtime.
        </p>
        <ul className="space-y-2">
          {platforms.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <span className="font-medium">{p.name}</span>
              <button
                type="button"
                onClick={() => {
                  togglePlatform(p.id);
                  toast.success(
                    p.connected ? `${p.name} disconnected` : `${p.name} connected`
                  );
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  p.connected
                    ? "border border-white/20 text-white/60"
                    : "bg-[#FF1E3C] text-white"
                }`}
              >
                {p.connected ? "Disconnect" : "Connect"}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default Profile;
