import React, { useEffect, useMemo, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const seedGoals = [
  {
    id: 1,
    name: "Goa Trip",
    emoji: "🌊",
    saved: 3200,
    target: 8000,
    pool: true,
    members: ["R", "Z", "A"],
    accent: "#A78BFA",
    note: "Squad pool",
  },
  {
    id: 2,
    name: "Sneakers",
    emoji: "👟",
    saved: 1800,
    target: 2500,
    pool: false,
    members: ["R"],
    accent: "#34D399",
    note: "Personal target",
  },
  {
    id: 3,
    name: "MacBook",
    emoji: "💻",
    saved: 12400,
    target: 65000,
    pool: false,
    members: ["R"],
    accent: "#60A5FA",
    note: "Long-term build",
  },
];

const squad = [
  { name: "Zaid", av: "Z", aheadBy: 600, color: "#6EE7B7", streak: 21 },
  { name: "Priya", av: "P", aheadBy: 150, color: "#A78BFA", streak: 12 },
  { name: "Aryan", av: "A", aheadBy: 0, color: "#93C5FD", streak: 9 },
];

const activity = [
  { icon: "⚡", title: "Saved ₹200", meta: "2 min ago" },
  { icon: "🔥", title: "14 day streak", meta: "Today" },
  { icon: "🎯", title: "Goal boosted", meta: "Goa Trip" },
];

const missions = [
  { title: "Save ₹1,000", reward: "+200 XP", progress: 68 },
  { title: "3-day streak", reward: "Unlock badge", progress: 100 },
  { title: "No impulse spend", reward: "+50 XP", progress: 42 },
];

const rewards = ["Gold Saver", "Streak Master", "Goal Closer", "No-Spend Mode"];

const profileBadges = [
  { label: "Level", value: "07" },
  { label: "Streak", value: "14d" },
  { label: "XP", value: "680" },
  { label: "Saved", value: "₹13.4K" },
];

/* ─────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────── */
function useCountUp(target, ms = 1100, go = false) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!go) return;
    let raf = 0;
    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setV(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, go]);

  return v;
}

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────────
   HOME
───────────────────────────────────────────────────────────── */
function HomeScreen({
  ready,
  dailySaved,
  setDailySaved,
  xp,
  setXp,
  balance,
  streak,
  activeGoalId,
  setActiveGoalId,
  goals,
  setGoals,
}) {
  const goal = goals.find((g) => g.id === activeGoalId) || goals[0];
  const progress = useMemo(
    () => Math.round((goal.saved / goal.target) * 100),
    [goal]
  );
  const remaining = Math.max(goal.target - goal.saved, 0);
  const nextStep = dailySaved ? "Saved for today" : `Save ₹200 today`;
  const impactDays = dailySaved ? 3 : 1;

  const saveNow = () => {
    if (dailySaved) return;
    setDailySaved(true);
    setXp((x) => x + 50);
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id
          ? { ...g, saved: Math.min(g.saved + 200, g.target) }
          : g
      )
    );
  };

  return (
    <div className="screen">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="status-island-wrap">
        <div className="island">
          <div className="i-pill" />
          <div className="i-cam" />
        </div>
      </div>

      <div className="status-row">
        <span>9:41</span>
        <span className="battery">98%</span>
      </div>

      <div className="hero-wrap enter">
        <div className="hero-copy">
          <div className="eyebrow">Friday, March 20</div>
          <div className="hero-title">Hey, Rizzak</div>
          <div className="hero-sub">
            Your money should feel alive, not hidden in a dead balance sheet.
          </div>
        </div>

        <div className="hero-badge">
          <div className="hero-badge-top">LVL</div>
          <div className="hero-badge-num">7</div>
        </div>
      </div>

      <div className="chips-row enter delay-1">
        <div className="chip">
          <span>🔥</span>
          <strong>{streak}d</strong>
        </div>
        <div className="chip">
          <span>⚡</span>
          <strong>{xp}</strong>
        </div>
        <div className="chip chip-glow">
          <span>💰</span>
          <strong>₹{balance.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div className="card big-cta enter delay-2">
        <div className="card-kicker">TODAY’S MOVE</div>
        <div className="big-cta-title">{nextStep}</div>

        <div className="impact-line">
          <span>+₹200</span>
          <span>→ Goal {impactDays} days faster</span>
        </div>

        <button
          className={cx("cta-btn", dailySaved && "cta-done")}
          onClick={saveNow}
        >
          {dailySaved ? "Saved ✓" : "Save Now"}
        </button>

        <div className="mini-pulse">
          <div className="mini-pulse-dot" />
          <span>
            {dailySaved ? "Momentum locked" : "Tap to trigger reward"}
          </span>
        </div>
      </div>

      <div className="card wallet enter delay-3">
        <div className="wallet-left">
          <div className="card-kicker">TOTAL SAVED</div>
          <div className="wallet-money">₹{balance.toLocaleString("en-IN")}</div>
          <div className="wallet-note">Tap any amount later to hide/show</div>
        </div>
        <div className="wallet-ring">
          <div className="wallet-ring-inner">
            <div className="wallet-ring-num">{progress}%</div>
            <div className="wallet-ring-label">to goal</div>
          </div>
        </div>
      </div>

      <div
        className="card goal-card enter delay-4"
        onClick={() => setActiveGoalId(goal.id)}
      >
        <div className="goal-top">
          <div className="goal-icon">{goal.emoji}</div>
          <div className="goal-copy">
            <div className="goal-name">{goal.name}</div>
            <div className="goal-note">{goal.note}</div>
          </div>
          <div className="goal-percent">{progress}%</div>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: ready ? `${progress}%` : "0%",
              background: goal.accent,
            }}
          />
        </div>

        <div className="goal-foot">
          <span>₹{goal.saved.toLocaleString("en-IN")}</span>
          <span>₹{remaining.toLocaleString("en-IN")} left</span>
        </div>
      </div>

      <div className="section-head enter delay-5">
        <div className="section-title">Squad pressure</div>
        <div className="section-link">Leaderboard</div>
      </div>

      <div className="squad-stack enter delay-6">
        {squad.map((s, idx) => (
          <div className="squad-row" key={s.name}>
            <div
              className="squad-av"
              style={{
                background: `${s.color}15`,
                borderColor: `${s.color}30`,
                color: s.color,
              }}
            >
              {s.av}
            </div>
            <div className="squad-mid">
              <div className="squad-name">
                <span style={{ color: s.color }}>{s.name}</span>
                <span className="squad-muted">
                  {idx === 0 ? " is ahead " : " saved more "}
                  {idx === 0 ? "🔥" : ""}
                </span>
              </div>
              <div className="squad-sub">
                {idx === 0 ? `Beat him today` : `${s.streak} day streak`}
              </div>
            </div>
            <div className="squad-right">
              {idx === 0 ? `₹${s.aheadBy}` : `+${s.streak}d`}
            </div>
          </div>
        ))}
      </div>

      <div className="section-head enter delay-7">
        <div className="section-title">Momentum feed</div>
        <div className="section-link">Live</div>
      </div>

      <div className="feed-grid enter delay-8">
        {activity.map((a) => (
          <div className="feed-card" key={a.title}>
            <div className="feed-icon">{a.icon}</div>
            <div className="feed-title">{a.title}</div>
            <div className="feed-meta">{a.meta}</div>
          </div>
        ))}
      </div>

      <div className="section-head enter delay-9">
        <div className="section-title">Goals</div>
        <div className="section-link">See all</div>
      </div>

      <div className="goal-strip enter delay-10">
        {goals.slice(0, 2).map((g) => {
          const p = Math.round((g.saved / g.target) * 100);
          return (
            <div
              className={cx(
                "mini-goal",
                g.id === goal.id && "mini-goal-active"
              )}
              key={g.id}
              onClick={() => setActiveGoalId(g.id)}
            >
              <div className="mini-goal-top">
                <span>{g.emoji}</span>
                <span>{p}%</span>
              </div>
              <div className="mini-goal-name">{g.name}</div>
              <div className="mini-goal-bar">
                <div
                  className="mini-goal-fill"
                  style={{
                    width: ready ? `${p}%` : "0%",
                    background: g.accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="space" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GROW
───────────────────────────────────────────────────────────── */
function GrowScreen() {
  const [autoSave, setAutoSave] = useState(true);
  const [vaultLock, setVaultLock] = useState(true);
  const [marketGlow, setMarketGlow] = useState(true);

  return (
    <div className="screen">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="status-island-wrap">
        <div className="island">
          <div className="i-pill" />
          <div className="i-cam" />
        </div>
      </div>

      <div className="status-row">
        <span>9:41</span>
        <span className="battery">98%</span>
      </div>

      <div className="page-title enter">Grow</div>
      <div className="page-sub enter delay-1">Turn saving into a machine.</div>

      <div className="grow-hero enter delay-2">
        <div className="grow-hero-left">
          <div className="card-kicker">YOUR MONEY</div>
          <div className="grow-hero-title">Working for you</div>
          <div className="grow-hero-sub">
            Save, lock, grow, and watch it compound into something louder.
          </div>
        </div>
        <div className="grow-glow">
          <div className="grow-glow-num">8%</div>
          <div className="grow-glow-sub">target returns</div>
        </div>
      </div>

      <div className="stack-2 enter delay-3">
        <div className="card toggle-card">
          <div>
            <div className="mini-label">AUTO SAVE</div>
            <div className="mini-big">₹50/day</div>
          </div>
          <button
            className={cx("toggle", autoSave && "toggle-on")}
            onClick={() => setAutoSave((v) => !v)}
          >
            <span className="toggle-dot" />
          </button>
        </div>

        <div className="card toggle-card">
          <div>
            <div className="mini-label">VAULT</div>
            <div className="mini-big">{vaultLock ? "Locked" : "Unlocked"}</div>
          </div>
          <button
            className={cx("toggle", vaultLock && "toggle-on")}
            onClick={() => setVaultLock((v) => !v)}
          >
            <span className="toggle-dot" />
          </button>
        </div>
      </div>

      <div className="card deep-card enter delay-4">
        <div className="section-title">Projection</div>
        <div className="projection-grid">
          <div className="projection-row">
            <span>1y</span>
            <div className="projection-bar">
              <div className="projection-fill" style={{ width: "30%" }} />
            </div>
            <strong>₹1.2L</strong>
          </div>
          <div className="projection-row">
            <span>5y</span>
            <div className="projection-bar">
              <div
                className="projection-fill projection-fill-green"
                style={{ width: "82%" }}
              />
            </div>
            <strong>₹8L</strong>
          </div>
          <div className="projection-row">
            <span>10y</span>
            <div className="projection-bar">
              <div
                className="projection-fill projection-fill-purple"
                style={{ width: "93%" }}
              />
            </div>
            <strong>₹22L</strong>
          </div>
        </div>
      </div>

      <div className="stack-2 enter delay-5">
        {missions.map((m) => (
          <div className="card mission-card" key={m.title}>
            <div className="mini-label">{m.reward}</div>
            <div className="mini-big">{m.title}</div>
            <div className="mission-track">
              <div
                className="mission-fill"
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card insight-card enter delay-6">
        <div className="insight-row">
          <div>
            <div className="mini-label">INSIGHT</div>
            <div className="mini-big">Spent ₹2,300 on food</div>
          </div>
          <div className="insight-badge">Save ₹300</div>
        </div>
        <div className="insight-sub">
          That becomes roughly ₹15K/year if you fix the leak.
        </div>
      </div>

      <div className="card p2p-card enter delay-7">
        <div className="card-kicker">P2P LENDING</div>
        <div className="p2p-title">Earn while your balance sits still</div>
        <div className="p2p-sub">
          Future module. Squad lending, controlled risk, real returns.
        </div>
        <div className="p2p-tags">
          <span>Low risk</span>
          <span>8% target</span>
          <span>Coming soon</span>
        </div>
      </div>

      <div className="card reward-card enter delay-8">
        <div className="section-title">Rewards</div>
        <div className="reward-grid">
          {rewards.map((r) => (
            <div className="reward-pill" key={r}>
              {r}
            </div>
          ))}
        </div>
      </div>

      <div className="space" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOALS
───────────────────────────────────────────────────────────── */
function GoalsScreen({ goals, ready, setGoals, setActiveGoalId }) {
  return (
    <div className="screen">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="status-island-wrap">
        <div className="island">
          <div className="i-pill" />
          <div className="i-cam" />
        </div>
      </div>

      <div className="status-row">
        <span>9:41</span>
        <span className="battery">98%</span>
      </div>

      <div className="page-title enter">Targets</div>
      <div className="page-sub enter delay-1">Make the money feel real.</div>

      <div className="targets-hero enter delay-2">
        <div className="targets-hero-left">
          <div className="card-kicker">ACTIVE TARGETS</div>
          <div className="targets-hero-title">{goals.length} live goals</div>
        </div>
        <div className="targets-hero-right">
          <div className="targets-hero-num">
            {goals.reduce((a, g) => a + g.saved, 0).toLocaleString("en-IN")}
          </div>
          <div className="targets-hero-sub">saved so far</div>
        </div>
      </div>

      <div className="goals-list enter delay-3">
        {goals.map((g, i) => {
          const p = Math.round((g.saved / g.target) * 100);
          return (
            <div
              key={g.id}
              className={cx("goal-card-2", g.pool && "goal-card-pool")}
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
              onClick={() => setActiveGoalId(g.id)}
            >
              <div className="goal-top">
                <div className="goal-icon">{g.emoji}</div>
                <div className="goal-copy">
                  <div className="goal-name">{g.name}</div>
                  <div className="goal-note">
                    {g.pool ? "Squad pool" : "Personal target"}
                  </div>
                </div>
                <div className="goal-percent">{p}%</div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: ready ? `${p}%` : "0%",
                    background: g.pool ? "#A78BFA" : g.accent,
                  }}
                />
              </div>

              <div className="goal-foot">
                <span>₹{g.saved.toLocaleString("en-IN")}</span>
                <span>₹{g.target.toLocaleString("en-IN")}</span>
              </div>

              {g.pool && (
                <div className="pool-row">
                  <div className="pool-badges">
                    {g.members.map((m) => (
                      <div className="pool-badge" key={m}>
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="pool-copy">Shared with the squad</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROFILE
───────────────────────────────────────────────────────────── */
function ProfileScreen({ xp, balance }) {
  return (
    <div className="screen">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="status-island-wrap">
        <div className="island">
          <div className="i-pill" />
          <div className="i-cam" />
        </div>
      </div>

      <div className="status-row">
        <span>9:41</span>
        <span className="battery">98%</span>
      </div>

      <div className="page-title enter">Profile</div>
      <div className="page-sub enter delay-1">
        Identity, status, and control.
      </div>

      <div className="profile-hero enter delay-2">
        <div className="profile-avatar">R</div>
        <div className="profile-name">Rizzak</div>
        <div className="profile-role">Gold Saver · Founder mode</div>
      </div>

      <div className="badge-grid enter delay-3">
        {profileBadges.map((b) => (
          <div className="badge-card" key={b.label}>
            <div className="mini-label">{b.label}</div>
            <div className="badge-value">{b.value}</div>
          </div>
        ))}
      </div>

      <div className="card profile-stack enter delay-4">
        <div className="section-title">Status</div>
        <div className="status-list">
          <div className="status-item">
            <span>LVL 07</span>
            <strong>Elite saver</strong>
          </div>
          <div className="status-item">
            <span>XP</span>
            <strong>{xp}</strong>
          </div>
          <div className="status-item">
            <span>Balance</span>
            <strong>₹{balance.toLocaleString("en-IN")}</strong>
          </div>
          <div className="status-item">
            <span>Mode</span>
            <strong>Locked in</strong>
          </div>
        </div>
      </div>

      <div className="card profile-stack enter delay-5">
        <div className="section-title">Badges</div>
        <div className="reward-grid">
          {rewards.map((r) => (
            <div className="reward-pill" key={r}>
              {r}
            </div>
          ))}
        </div>
      </div>

      <div className="card profile-stack enter delay-6">
        <div className="section-title">Controls</div>
        <div className="setting-row">
          <span>Notifications</span>
          <strong>On</strong>
        </div>
        <div className="setting-row">
          <span>Auto-save</span>
          <strong>₹50/day</strong>
        </div>
        <div className="setting-row">
          <span>Privacy</span>
          <strong>Hidden balance</strong>
        </div>
      </div>

      <div className="card profile-stack enter delay-7">
        <div className="section-title">Recent</div>
        <div className="recent-list">
          <div className="recent-item">
            <span>+₹200 saved</span>
            <strong>Today</strong>
          </div>
          <div className="recent-item">
            <span>Goal boosted</span>
            <strong>Goa Trip</strong>
          </div>
          <div className="recent-item">
            <span>Streak saved</span>
            <strong>14d</strong>
          </div>
        </div>
      </div>

      <div className="space" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CREATE GOAL SHEET
───────────────────────────────────────────────────────────── */
function CreateGoalOverlay({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [pool, setPool] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 260);
  };

  const submit = () => {
    if (!name.trim() || !target) return;
    onAdd({
      id: Date.now(),
      name: name.trim(),
      emoji,
      saved: 0,
      target: Number(target),
      pool,
      members: pool ? ["R", "P", "Z"] : ["R"],
      accent: pool ? "#A78BFA" : "#34D399",
      note: pool ? "Squad pool" : "Personal target",
    });
    close();
  };

  const nextEmoji = () => {
    const list = ["🎯", "✈️", "💻", "👟", "📱", "🌙", "🚀", "🧠"];
    const idx = list.indexOf(emoji);
    setEmoji(list[(idx + 1) % list.length]);
  };

  return (
    <>
      <div
        className={cx("backdrop", closing ? "fade-out" : "fade-in")}
        onClick={close}
      />
      <div className={cx("bottom-sheet", closing ? "slide-down" : "slide-up")}>
        <div className="sheet-handle" />
        <div className="sheet-title">New Target</div>
        <div className="sheet-sub">Make it emotionally loud.</div>

        <div className="sheet-row">
          <button className="emoji-btn" onClick={nextEmoji}>
            {emoji}
          </button>
          <input
            autoFocus
            placeholder="Goal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sheet-input"
          />
        </div>

        <div className="sheet-row sheet-money">
          <span>₹</span>
          <input
            type="number"
            placeholder="Target amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="sheet-input money-input"
          />
        </div>

        <div className="sheet-toggle">
          <div>
            <div className="toggle-title">Squad pool</div>
            <div className="toggle-sub">Invite friends to save together</div>
          </div>
          <button
            className={cx("toggle", pool && "toggle-on")}
            onClick={() => setPool((v) => !v)}
          >
            <span className="toggle-dot" />
          </button>
        </div>

        <button className="sheet-submit" onClick={submit}>
          Create Target
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────── */
export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);

  const [dailySaved, setDailySaved] = useState(false);
  const [xp, setXp] = useState(680);
  const [balance, setBalance] = useState(13400);
  const [streak] = useState(14);
  const [activeGoalId, setActiveGoalId] = useState(1);
  const [goals, setGoals] = useState(seedGoals);

  const animatedBalance = useCountUp(balance, 1200, ready);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 180);
    return () => clearTimeout(t);
  }, []);

  const addGoal = (goal) => {
    setGoals((prev) => [goal, ...prev]);
    setActiveGoalId(goal.id);
    setActiveTab("goals");
  };

  const nav = [
    { id: "home", icon: "🏠" },
    { id: "goals", icon: "🎯" },
    { id: "add", icon: "+", fab: true },
    { id: "grow", icon: "⚡" },
    { id: "profile", icon: "👤" },
  ];

  return (
    <div className="shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        *{
          box-sizing:border-box;
          margin:0;
          padding:0;
          -webkit-font-smoothing:antialiased;
        }

        body{
          margin:0;
          background:#050505;
        }

        input, button{
          font: inherit;
        }

        .shell{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(circle at 20% 10%, rgba(167,139,250,0.12), transparent 24%),
            radial-gradient(circle at 80% 20%, rgba(52,211,153,0.10), transparent 22%),
            radial-gradient(circle at 50% 95%, rgba(96,165,250,0.10), transparent 25%),
            #050505;
          font-family:'Outfit',-apple-system,sans-serif;
          padding:14px;
        }

        .phone{
          width:min(393px, 100vw);
          height:min(852px, 100vh);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.02), transparent 18%),
            #000;
          border-radius:52px;
          overflow:hidden;
          position:relative;
          box-shadow:
            0 0 0 1px #202024,
            0 0 0 2px #0A0A0C,
            0 70px 190px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .screen{
          position:relative;
          height:100%;
          overflow-y:auto;
          overflow-x:hidden;
          padding-bottom:106px;
          scrollbar-width:none;
          color:#fff;
        }

        .screen::-webkit-scrollbar{ display:none; }

        .bg-orb{
          position:absolute;
          border-radius:999px;
          pointer-events:none;
          filter: blur(24px);
          opacity:0.8;
          z-index:0;
        }

        .orb-1{
          width:160px;
          height:160px;
          top:-28px;
          right:-38px;
          background:radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%);
        }

        .orb-2{
          width:120px;
          height:120px;
          top:240px;
          left:-34px;
          background:radial-gradient(circle, rgba(52,211,153,0.15), transparent 72%);
        }

        .orb-3{
          width:180px;
          height:180px;
          bottom:90px;
          right:-60px;
          background:radial-gradient(circle, rgba(96,165,250,0.14), transparent 70%);
        }

        .status-island-wrap{
          padding-top:12px;
          position:relative;
          z-index:2;
        }

        .island{
          width:128px;
          height:36px;
          background:#000;
          border-radius:0 0 26px 26px;
          margin:0 auto;
          border:1px solid #141416;
          border-top:none;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
        }

        .i-pill{
          width:10px;
          height:10px;
          border-radius:50%;
          background:#0E0E10;
          border:1.5px solid #1A1A1E;
        }

        .i-cam{
          width:13px;
          height:13px;
          border-radius:50%;
          background:#0E0E10;
          border:1.5px solid #1A1A1E;
          position:relative;
        }

        .i-cam::after{
          content:'';
          position:absolute;
          inset:3px;
          border-radius:50%;
          background:#fff;
          opacity:0.2;
        }

        .status-row{
          display:flex;
          justify-content:space-between;
          padding:10px 30px 0;
          font-size:13px;
          font-weight:700;
          color:#fff;
          position:relative;
          z-index:2;
        }

        .battery{
          color:#34D399;
        }

        .enter{
          opacity:0;
          transform:translateY(14px);
          animation:enter 0.58s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .delay-1{ animation-delay:.05s; }
        .delay-2{ animation-delay:.10s; }
        .delay-3{ animation-delay:.15s; }
        .delay-4{ animation-delay:.20s; }
        .delay-5{ animation-delay:.25s; }
        .delay-6{ animation-delay:.30s; }
        .delay-7{ animation-delay:.35s; }
        .delay-8{ animation-delay:.40s; }
        .delay-9{ animation-delay:.45s; }
        .delay-10{ animation-delay:.50s; }

        @keyframes enter{
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .hero-wrap{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:14px;
          padding:22px 22px 8px;
          position:relative;
          z-index:2;
        }

        .eyebrow{
          font-size:11px;
          color:#2E2E34;
          font-weight:700;
          letter-spacing:1.8px;
          text-transform:uppercase;
        }

        .hero-title{
          font-size:30px;
          font-weight:900;
          line-height:1.02;
          letter-spacing:-1.4px;
          margin-top:5px;
        }

        .hero-sub{
          font-size:13px;
          color:#6B6B78;
          line-height:1.6;
          margin-top:10px;
          max-width:250px;
        }

        .hero-badge{
          width:74px;
          height:74px;
          border-radius:24px;
          background:
            radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 42%),
            linear-gradient(145deg, #111113, #0B0B0D);
          border:1px solid #2A2A2E;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 18px 50px rgba(0,0,0,0.55);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }

        .hero-badge-top{
          font-size:8px;
          color:rgba(255,255,255,0.28);
          letter-spacing:2px;
          font-weight:800;
        }

        .hero-badge-num{
          font-size:28px;
          font-weight:900;
          line-height:1;
          margin-top:3px;
        }

        .chips-row{
          display:flex;
          gap:10px;
          padding:0 22px 18px;
          position:relative;
          z-index:2;
        }

        .chip{
          flex:1;
          background:linear-gradient(180deg, #131315, #0f0f11);
          border:1px solid #1C1C20;
          border-radius:18px;
          min-height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .chip span{
          font-size:16px;
        }

        .chip strong{
          font-size:16px;
          font-weight:800;
          letter-spacing:-0.4px;
        }

        .chip-glow{
          border-color:rgba(52,211,153,0.25);
          box-shadow:0 0 0 1px rgba(52,211,153,0.06), inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .card{
          background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), #111113;
          border:1px solid #1C1C20;
          border-radius:26px;
          overflow:hidden;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 24px 60px rgba(0,0,0,0.46);
        }

        .big-cta{
          margin:0 20px 16px;
          padding:22px;
          border-color:rgba(52,211,153,0.18);
          background:
            radial-gradient(circle at 80% 20%, rgba(52,211,153,0.10), transparent 24%),
            linear-gradient(135deg, #16161a 0%, #0f0f11 100%);
        }

        .card-kicker{
          font-size:10px;
          color:#2E2E34;
          font-weight:800;
          letter-spacing:1.8px;
          text-transform:uppercase;
        }

        .big-cta-title{
          font-size:24px;
          font-weight:900;
          letter-spacing:-0.9px;
          margin-top:8px;
        }

        .impact-line{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-top:12px;
          font-size:12px;
          color:#B3B3BE;
        }

        .impact-line span:first-child{
          color:#34D399;
          font-weight:800;
        }

        .cta-btn{
          width:100%;
          height:54px;
          border-radius:18px;
          margin-top:18px;
          border:none;
          background:#fff;
          color:#000;
          font-size:15px;
          font-weight:900;
          letter-spacing:-0.2px;
          cursor:pointer;
          box-shadow:0 14px 36px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.9);
          transition:transform .18s, box-shadow .18s, opacity .18s;
        }

        .cta-btn:hover{ transform:translateY(-1px); }
        .cta-btn:active{ transform:scale(0.98); }
        .cta-done{
          background:transparent;
          color:#fff;
          opacity:0.45;
          border:1px solid #25252b;
          box-shadow:none;
        }

        .mini-pulse{
          margin-top:12px;
          display:flex;
          align-items:center;
          gap:8px;
          color:#6B6B78;
          font-size:12px;
        }

        .mini-pulse-dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:#34D399;
          box-shadow:0 0 8px #34D399;
          animation:blink 1.9s ease infinite;
        }

        @keyframes blink{
          0%,100%{opacity:1}
          50%{opacity:.35}
        }

        .wallet{
          margin:0 20px 16px;
          padding:18px 20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
        }

        .wallet-money{
          font-size:32px;
          font-weight:900;
          letter-spacing:-1.5px;
          line-height:1;
          margin-top:6px;
        }

        .wallet-note{
          font-size:12px;
          color:#6B6B78;
          margin-top:7px;
        }

        .wallet-ring{
          width:82px;
          height:82px;
          border-radius:50%;
          background:
            conic-gradient(from 90deg, #fff 0 40%, #1A1A1E 40% 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }

        .wallet-ring-inner{
          width:62px;
          height:62px;
          border-radius:50%;
          background:#0b0b0d;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          border:1px solid #1c1c20;
        }

        .wallet-ring-num{
          font-size:16px;
          font-weight:900;
          line-height:1;
        }

        .wallet-ring-label{
          font-size:9px;
          color:#6B6B78;
          margin-top:2px;
          letter-spacing:1px;
          text-transform:uppercase;
        }

        .section-head{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:8px 22px 10px;
          position:relative;
          z-index:2;
        }

        .section-title{
          font-size:16px;
          font-weight:900;
          letter-spacing:-0.4px;
        }

        .section-link{
          font-size:12px;
          color:#6B6B78;
          font-weight:700;
        }

        .goal-card{
          margin:0 20px 16px;
          padding:18px 18px 16px;
          cursor:pointer;
        }

        .goal-top{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .goal-icon{
          width:48px;
          height:48px;
          border-radius:16px;
          background:#0D0D0F;
          border:1px solid #1A1A1E;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:22px;
          flex-shrink:0;
        }

        .goal-copy{
          flex:1;
          min-width:0;
        }

        .goal-name{
          font-size:16px;
          font-weight:800;
          letter-spacing:-0.4px;
        }

        .goal-note{
          font-size:12px;
          color:#6B6B78;
          margin-top:3px;
        }

        .goal-percent{
          font-size:18px;
          font-weight:900;
          letter-spacing:-0.6px;
        }

        .progress-track{
          height:6px;
          background:#1A1A1E;
          border-radius:999px;
          overflow:hidden;
          margin-top:14px;
        }

        .progress-fill{
          height:100%;
          border-radius:999px;
          transition:width 1.2s cubic-bezier(0.22,1,0.36,1);
        }

        .goal-foot{
          display:flex;
          justify-content:space-between;
          margin-top:10px;
          font-size:12px;
          color:#B3B3BE;
        }

        .goal-strip{
          display:flex;
          gap:10px;
          padding:0 20px 8px;
          position:relative;
          z-index:2;
        }

        .mini-goal{
          flex:1;
          min-width:0;
          padding:14px;
          border-radius:20px;
          background:#111113;
          border:1px solid #1C1C20;
          cursor:pointer;
        }

        .mini-goal-active{
          border-color:rgba(255,255,255,0.18);
          box-shadow:0 14px 32px rgba(0,0,0,0.36);
        }

        .mini-goal-top{
          display:flex;
          justify-content:space-between;
          font-size:12px;
          color:#fff;
          font-weight:800;
        }

        .mini-goal-name{
          font-size:14px;
          font-weight:800;
          margin-top:10px;
          letter-spacing:-0.3px;
        }

        .mini-goal-bar{
          height:5px;
          background:#1A1A1E;
          border-radius:999px;
          overflow:hidden;
          margin-top:10px;
        }

        .mini-goal-fill{
          height:100%;
          border-radius:999px;
          transition:width 1.2s cubic-bezier(0.22,1,0.36,1);
        }

        .squad-stack{
          display:flex;
          flex-direction:column;
          gap:10px;
          padding:0 20px 6px;
          position:relative;
          z-index:2;
        }

        .squad-row{
          display:flex;
          align-items:center;
          gap:12px;
          padding:14px 16px;
          background:#111113;
          border:1px solid #1C1C20;
          border-radius:22px;
        }

        .squad-av{
          width:44px;
          height:44px;
          border-radius:50%;
          border:1px solid;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          font-weight:900;
          flex-shrink:0;
        }

        .squad-mid{
          flex:1;
          min-width:0;
        }

        .squad-name{
          font-size:14px;
          font-weight:800;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .squad-muted{
          color:#6B6B78;
          font-weight:600;
        }

        .squad-sub{
          font-size:12px;
          color:#6B6B78;
          margin-top:3px;
        }

        .squad-right{
          font-size:15px;
          font-weight:900;
          color:#fff;
          letter-spacing:-0.4px;
        }

        .feed-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:10px;
          padding:0 20px 4px;
          position:relative;
          z-index:2;
        }

        .feed-card{
          background:#111113;
          border:1px solid #1C1C20;
          border-radius:20px;
          padding:14px 12px;
          min-height:96px;
        }

        .feed-icon{
          font-size:18px;
        }

        .feed-title{
          font-size:13px;
          font-weight:800;
          margin-top:12px;
          line-height:1.25;
        }

        .feed-meta{
          font-size:11px;
          color:#6B6B78;
          margin-top:5px;
        }

        .space{
          height:12px;
        }

        .grow-hero{
          margin:8px 20px 16px;
          padding:18px 18px 18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          border-radius:26px;
          background:
            radial-gradient(circle at 80% 18%, rgba(167,139,250,0.12), transparent 30%),
            radial-gradient(circle at 20% 80%, rgba(52,211,153,0.10), transparent 28%),
            linear-gradient(135deg, #111113, #0B0B0D);
          border:1px solid #1C1C20;
        }

        .grow-hero-title{
          font-size:24px;
          font-weight:900;
          letter-spacing:-1px;
          margin-top:6px;
        }

        .grow-hero-sub{
          font-size:12px;
          color:#6B6B78;
          margin-top:8px;
          max-width:210px;
          line-height:1.55;
        }

        .grow-glow{
          width:92px;
          height:92px;
          border-radius:26px;
          background:linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
          border:1px solid rgba(255,255,255,0.07);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .grow-glow-num{
          font-size:30px;
          font-weight:900;
          line-height:1;
        }

        .grow-glow-sub{
          font-size:10px;
          color:#6B6B78;
          margin-top:4px;
          text-transform:uppercase;
          letter-spacing:1px;
        }

        .stack-2{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          padding:0 20px 10px;
          position:relative;
          z-index:2;
        }

        .toggle-card{
          padding:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          min-height:92px;
        }

        .mini-label{
          font-size:10px;
          color:#6B6B78;
          font-weight:800;
          letter-spacing:1.6px;
          text-transform:uppercase;
        }

        .mini-big{
          font-size:18px;
          font-weight:900;
          letter-spacing:-0.5px;
          margin-top:6px;
        }

        .toggle{
          width:54px;
          height:30px;
          border-radius:999px;
          border:none;
          background:#2C2C32;
          position:relative;
          cursor:pointer;
          transition:background .2s;
          flex-shrink:0;
        }

        .toggle-on{
          background:#34D399;
        }

        .toggle-dot{
          position:absolute;
          top:5px;
          left:5px;
          width:20px;
          height:20px;
          border-radius:50%;
          background:#fff;
          transition:left .22s cubic-bezier(0.22,1,0.36,1);
        }

        .toggle-on .toggle-dot{
          left:29px;
        }

        .deep-card,
        .insight-card,
        .p2p-card,
        .reward-card,
        .profile-stack{
          margin:0 20px 12px;
          padding:18px;
        }

        .projection-grid{
          display:flex;
          flex-direction:column;
          gap:14px;
          margin-top:14px;
        }

        .projection-row{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:12px;
          color:#6B6B78;
        }

        .projection-row strong{
          color:#fff;
          font-size:14px;
          font-weight:900;
          min-width:58px;
          text-align:right;
        }

        .projection-bar{
          flex:1;
          height:8px;
          border-radius:999px;
          overflow:hidden;
          background:#1A1A1E;
        }

        .projection-fill{
          height:100%;
          border-radius:999px;
          background:#fff;
        }

        .projection-fill-green{
          background:#34D399;
        }

        .projection-fill-purple{
          background:#A78BFA;
        }

        .mission-card{
          min-height:124px;
        }

        .mission-track{
          height:6px;
          margin-top:14px;
          border-radius:999px;
          background:#1A1A1E;
          overflow:hidden;
        }

        .mission-fill{
          height:100%;
          border-radius:999px;
          background:linear-gradient(90deg, #fff, #A78BFA);
        }

        .insight-row{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:12px;
        }

        .insight-badge{
          padding:8px 10px;
          border-radius:14px;
          background:rgba(52,211,153,0.12);
          border:1px solid rgba(52,211,153,0.18);
          color:#34D399;
          font-size:11px;
          font-weight:900;
          white-space:nowrap;
        }

        .insight-sub{
          font-size:12px;
          color:#6B6B78;
          line-height:1.6;
          margin-top:12px;
        }

        .p2p-title{
          font-size:22px;
          font-weight:900;
          letter-spacing:-0.8px;
          margin-top:8px;
        }

        .p2p-sub{
          font-size:12px;
          color:#6B6B78;
          line-height:1.55;
          margin-top:10px;
        }

        .p2p-tags{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:14px;
        }

        .p2p-tags span{
          padding:7px 10px;
          border-radius:999px;
          border:1px solid #1C1C20;
          background:#0D0D0F;
          color:#B3B3BE;
          font-size:11px;
          font-weight:800;
        }

        .reward-grid{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:14px;
        }

        .reward-pill{
          padding:10px 12px;
          border-radius:999px;
          background:#0D0D0F;
          border:1px solid #1C1C20;
          font-size:12px;
          font-weight:800;
          color:#fff;
        }

        .targets-hero{
          margin:8px 20px 16px;
          padding:18px;
          display:flex;
          justify-content:space-between;
          align-items:flex-end;
          border-radius:26px;
          background:
            radial-gradient(circle at 80% 15%, rgba(255,255,255,0.05), transparent 20%),
            linear-gradient(135deg, #111113, #0B0B0D);
          border:1px solid #1C1C20;
        }

        .targets-hero-title{
          font-size:22px;
          font-weight:900;
          letter-spacing:-0.8px;
          margin-top:6px;
        }

        .targets-hero-num{
          font-size:24px;
          font-weight:900;
          letter-spacing:-1px;
          text-align:right;
        }

        .targets-hero-sub{
          font-size:11px;
          color:#6B6B78;
          text-align:right;
          margin-top:4px;
        }

        .goals-list{
          display:flex;
          flex-direction:column;
          gap:12px;
          padding:0 20px;
          position:relative;
          z-index:2;
        }

        .goal-card-2{
          padding:18px;
          background:#111113;
          border:1px solid #1C1C20;
          border-radius:24px;
          cursor:pointer;
        }

        .goal-card-pool{
          border-color:rgba(167,139,250,0.16);
          box-shadow:0 0 0 1px rgba(167,139,250,0.04);
        }

        .pool-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:12px;
          gap:10px;
        }

        .pool-badges{
          display:flex;
        }

        .pool-badge{
          width:18px;
          height:18px;
          border-radius:50%;
          margin-left:-5px;
          border:1px solid #111;
          background:#fff;
          color:#000;
          font-size:9px;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .pool-copy{
          font-size:11px;
          color:#A78BFA;
          font-weight:700;
        }

        .profile-hero{
          margin:8px 20px 16px;
          padding:24px 18px 20px;
          border-radius:28px;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 28%),
            linear-gradient(135deg, #111113, #0B0B0D);
          border:1px solid #1C1C20;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
        }

        .profile-avatar{
          width:92px;
          height:92px;
          border-radius:50%;
          background:
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.2), transparent 28%),
            #fff;
          color:#000;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:30px;
          font-weight:900;
          box-shadow:0 18px 45px rgba(255,255,255,0.12);
        }

        .profile-name{
          font-size:24px;
          font-weight:900;
          letter-spacing:-0.8px;
          margin-top:14px;
        }

        .profile-role{
          font-size:12px;
          color:#6B6B78;
          margin-top:6px;
        }

        .badge-grid{
          display:grid;
          grid-template-columns:repeat(2, 1fr);
          gap:10px;
          padding:0 20px 4px;
        }

        .badge-card{
          padding:16px;
          border-radius:22px;
          background:#111113;
          border:1px solid #1C1C20;
        }

        .badge-value{
          font-size:20px;
          font-weight:900;
          letter-spacing:-0.5px;
          margin-top:6px;
        }

        .status-list,
        .recent-list{
          display:flex;
          flex-direction:column;
          gap:10px;
          margin-top:14px;
        }

        .status-item,
        .setting-row,
        .recent-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding:14px 0;
          border-top:1px solid #161618;
          font-size:13px;
        }

        .status-item:first-child,
        .setting-row:first-child,
        .recent-item:first-child{
          border-top:none;
          padding-top:0;
        }

        .status-item span,
        .setting-row span,
        .recent-item span{
          color:#6B6B78;
        }

        .status-item strong,
        .setting-row strong,
        .recent-item strong{
          color:#fff;
        }

        .bottom-nav{
          position:absolute;
          bottom:0;
          left:0;
          right:0;
          height:90px;
          background:rgba(0,0,0,0.86);
          backdrop-filter:blur(36px) saturate(190%);
          border-top:1px solid #1C1C20;
          display:flex;
          align-items:flex-start;
          justify-content:space-around;
          padding:14px 6px 0;
          z-index:30;
        }

        .nav-item{
          flex:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          cursor:pointer;
          transition:opacity 0.15s;
          user-select:none;
        }

        .nav-item:active{ opacity:0.4; }

        .nav-icon{
          font-size:22px;
          color:#fff;
        }

        .nav-icon.dim{
          opacity:0.35;
        }

        .nav-dot{
          width:4px;
          height:4px;
          border-radius:50%;
          background:#fff;
        }

        .fab{
          width:58px;
          height:58px;
          border-radius:20px;
          background:linear-gradient(180deg, #fff, #ececec);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:30px;
          color:#000;
          font-weight:300;
          cursor:pointer;
          margin-top:-14px;
          box-shadow:0 12px 34px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.9);
          transition:transform 0.18s, box-shadow 0.18s;
        }

        .fab:active{
          transform:scale(0.92);
        }

        .backdrop{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,0.72);
          backdrop-filter:blur(8px);
          z-index:80;
        }

        .fade-in{ animation:fadeIn .24s forwards; }
        .fade-out{ animation:fadeOut .24s forwards; }

        @keyframes fadeIn{ from{opacity:0} to{opacity:1} }
        @keyframes fadeOut{ from{opacity:1} to{opacity:0} }

        .bottom-sheet{
          position:absolute;
          left:0;
          right:0;
          bottom:0;
          z-index:90;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 24%),
            #0D0D0F;
          border-top:1px solid #2C2C32;
          border-radius:32px 32px 0 0;
          padding:22px 18px 18px;
        }

        .slide-up{ animation:sheetUp .32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-down{ animation:sheetDown .28s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes sheetUp{ from{ transform:translateY(100%); } to{ transform:translateY(0); } }
        @keyframes sheetDown{ from{ transform:translateY(0); } to{ transform:translateY(100%); } }

        .sheet-handle{
          width:44px;
          height:4px;
          border-radius:999px;
          background:#2C2C32;
          margin:0 auto 18px;
        }

        .sheet-title{
          font-size:24px;
          font-weight:900;
          letter-spacing:-0.8px;
        }

        .sheet-sub{
          font-size:12px;
          color:#6B6B78;
          margin-top:6px;
        }

        .sheet-row{
          display:flex;
          align-items:center;
          gap:12px;
          margin-top:16px;
        }

        .emoji-btn{
          width:60px;
          height:60px;
          border-radius:18px;
          border:1px solid #1C1C20;
          background:#1A1A1E;
          color:#fff;
          font-size:28px;
          cursor:pointer;
        }

        .sheet-input{
          flex:1;
          height:60px;
          border:none;
          outline:none;
          border-radius:18px;
          background:#1A1A1E;
          color:#fff;
          padding:0 18px;
          font-size:16px;
          font-weight:700;
        }

        .sheet-money{
          background:#1A1A1E;
          border-radius:18px;
          padding:0 18px;
        }

        .sheet-money span{
          color:#6B6B78;
          font-size:20px;
          font-weight:700;
        }

        .money-input{
          background:transparent;
          padding-left:6px;
        }

        .sheet-toggle{
          margin-top:16px;
          padding:18px;
          background:#1A1A1E;
          border-radius:18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
        }

        .toggle-title{
          font-size:15px;
          font-weight:900;
        }

        .toggle-sub{
          font-size:12px;
          color:#6B6B78;
          margin-top:4px;
        }

        .sheet-submit{
          width:100%;
          height:54px;
          border:none;
          border-radius:18px;
          margin-top:18px;
          background:#fff;
          color:#000;
          font-weight:900;
          font-size:15px;
          cursor:pointer;
        }

        @media (max-width: 430px){
          .shell{
            padding:0;
            align-items:stretch;
          }
          .phone{
            width:100vw;
            height:100vh;
            border-radius:0;
          }
        }
      `}</style>

      <div className="phone">
        {activeTab === "home" && (
          <HomeScreen
            ready={ready}
            dailySaved={dailySaved}
            setDailySaved={setDailySaved}
            xp={xp}
            setXp={setXp}
            balance={animatedBalance}
            streak={streak}
            activeGoalId={activeGoalId}
            setActiveGoalId={setActiveGoalId}
            goals={goals}
            setGoals={setGoals}
          />
        )}

        {activeTab === "goals" && (
          <GoalsScreen
            goals={goals}
            ready={ready}
            setGoals={setGoals}
            setActiveGoalId={setActiveGoalId}
          />
        )}

        {activeTab === "grow" && <GrowScreen />}

        {activeTab === "profile" && (
          <ProfileScreen xp={xp} balance={animatedBalance} />
        )}

        <div className="bottom-nav">
          {nav.map((item) =>
            item.fab ? (
              <div key="fab" className="fab" onClick={() => setShowAdd(true)}>
                +
              </div>
            ) : (
              <div
                key={item.id}
                className="nav-item"
                onClick={() => setActiveTab(item.id)}
                style={{ opacity: activeTab === item.id ? 1 : 0.35 }}
              >
                <div className={cx("nav-icon", activeTab !== item.id && "dim")}>
                  {item.icon}
                </div>
                {activeTab === item.id && <div className="nav-dot" />}
              </div>
            )
          )}
        </div>

        {showAdd && (
          <CreateGoalOverlay
            onClose={() => setShowAdd(false)}
            onAdd={addGoal}
          />
        )}
      </div>
    </div>
  );
}
