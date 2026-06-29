import { useState, useEffect } from "react";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Search,
  LayoutDashboard,
  CheckCircle,
  Calendar,
  Settings,
  Bell,
  User,
  Clock,
  AlertTriangle,
  Flame,
  ChevronRight,
  Plus,
  X,
  Trash2,
  BellRing,
  Cog,
  ClipboardList,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────
type Page = "login" | "dashboard";
type ActiveSection = "dashboard" | "jadwal" | "tugas" | "notifikasi" | "pengaturan";

interface Task {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  done: boolean;
}

interface ClassItem {
  name: string;
  time: string;
  room: string;
  color: "cyan" | "purple" | "green" | "amber" | "rose";
}

// ─── schedule data ─────────────────────────────────────────────────────────────
const SCHEDULE: Record<string, ClassItem[]> = {
  Senin: [
    { name: "Kewirausahaan Teknologi", time: "08.00 – 09.45", room: "B3.1", color: "amber" },
  ],
  Selasa: [
    { name: "Komputasi Awan", time: "08.00 – 09.45", room: "B2.1", color: "cyan" },
    { name: "Konsep Arsitektur dan Perusahaan Sistem 1", time: "09.45 – 12.10", room: "Lab Desain Produk", color: "purple" },
    { name: "Pengelolaan Proyek Teknologi Informasi", time: "12.10 – 14.40", room: "Lab Desain Produk", color: "rose" },
  ],
  Rabu: [
    { name: "E-Government dan Kota Cerdas", time: "08.00 – 10.30", room: "A3.1", color: "green" },
    { name: "Aplikasi Internet of Things", time: "13.00 – 15.30", room: "Lab Data Sains dan Teknologi", color: "cyan" },
  ],
  Kamis: [
    { name: "Islam dan Saintek", time: "09.40 – 11.20", room: "B3.3", color: "purple" },
  ],
};

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis"] as const;

const CLASS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  cyan:   { bg: "rgba(0,229,255,0.07)",  border: "rgba(0,229,255,0.25)",  text: "#00e5ff" },
  purple: { bg: "rgba(179,71,255,0.07)", border: "rgba(179,71,255,0.28)", text: "#b347ff" },
  green:  { bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.28)", text: "#34d399" },
  amber:  { bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.28)", text: "#fbbf24" },
  rose:   { bg: "rgba(251,113,133,0.07)",border: "rgba(251,113,133,0.28)",text: "#fb7185" },
};

const COURSE_NAMES = Object.values(SCHEDULE).flat().map(c => c.name);

// ─── helpers ──────────────────────────────────────────────────────────────────
function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

// ─── GlassCard ────────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", neon = false, style, onClick }: {
  children: React.ReactNode; className?: string; neon?: boolean;
  style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={`rounded-2xl border backdrop-blur-xl ${className}`}
      style={{ background: "rgba(8,18,40,0.55)", borderColor: neon ? "rgba(0,229,255,0.45)" : "rgba(0,229,255,0.12)", boxShadow: neon ? "0 0 28px rgba(0,229,255,0.18),0 0 60px rgba(179,71,255,0.10),inset 0 1px 0 rgba(255,255,255,0.06)" : "0 4px 32px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.04)", cursor: onClick ? "pointer" : undefined, ...style }}>
      {children}
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function DeadlineToast({ tasks, onClose }: { tasks: Task[]; onClose: () => void }) {
  const h1 = tasks.filter(t => !t.done && daysUntil(t.deadline) === 1);
  if (h1.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 340 }}>
      {h1.map(t => (
        <div key={t.id} className="flex items-start gap-3 rounded-2xl p-4 animate-pulse"
          style={{ background: "rgba(255,77,109,0.12)", border: "1px solid rgba(255,77,109,0.45)", boxShadow: "0 0 24px rgba(255,77,109,0.2)", backdropFilter: "blur(16px)" }}>
          <BellRing size={18} color="#ff4d6d" className="flex-shrink-0 mt-0.5" style={{ filter: "drop-shadow(0 0 6px #ff4d6d)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>⚠ H-1 MENDESAK</p>
            <p className="text-sm font-semibold mt-0.5 leading-tight" style={{ color: "#e8f0fe" }}>{t.title}</p>
            <p className="text-xs mt-0.5" style={{ color: "#7b90b8" }}>{t.subject} · Besok</p>
          </div>
          <button onClick={onClose} style={{ color: "#7b90b8" }}><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// ─── CircleCountdown ──────────────────────────────────────────────────────────
function CircleCountdown({ days, urgent }: { days: number; urgent: boolean }) {
  const r = 18; const circ = 2 * Math.PI * r;
  const ratio = Math.max(0, Math.min(1, days / 14));
  const dash = circ * (1 - ratio);
  const label = days <= 0 ? "LEWAT" : days === 1 ? "1\nhari" : `${days}\nhari`;
  const color = urgent ? "#ff4d6d" : days <= 5 ? "#fbbf24" : "#00e5ff";
  return (
    <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
      <svg width={44} height={44}>
        <circle cx={22} cy={22} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" transform="rotate(-90 22 22)"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-center font-bold whitespace-pre-line"
        style={{ fontSize: "0.52rem", color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.1 }}>
        {label}
      </span>
    </div>
  );
}

// ─── AddTaskModal ─────────────────────────────────────────────────────────────
function AddTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Omit<Task, "id" | "done">) => void }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !deadline) { setError("Semua kolom wajib diisi."); return; }
    onAdd({ title: title.trim(), subject: subject.trim(), deadline });
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,229,255,0.2)",
    color: "#e8f0fe", width: "100%", borderRadius: 12, padding: "10px 16px", fontSize: 14, outline: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "rgba(2,8,16,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 relative"
        style={{ background: "rgba(8,18,40,0.97)", border: "1px solid rgba(0,229,255,0.3)", boxShadow: "0 0 40px rgba(0,229,255,0.12),0 -20px 60px rgba(0,0,0,0.6)" }}>
        {/* drag handle on mobile */}
        <div className="w-10 h-1 rounded-full mx-auto mb-4 sm:hidden" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-base" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Tambah Tugas Baru</h2>
            <p className="text-xs mt-0.5" style={{ color: "#7b90b8" }}>Isi detail tugas dan batas waktu pengumpulan</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", color: "#7b90b8" }}>
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#7b90b8" }}>Nama Tugas</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Laporan Praktikum" style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#7b90b8" }}>Mata Kuliah</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}>
              <option value="" disabled style={{ background: "#0a1429" }}>Pilih mata kuliah...</option>
              {COURSE_NAMES.map(n => <option key={n} value={n} style={{ background: "#0a1429" }}>{n}</option>)}
              <option value="Lainnya" style={{ background: "#0a1429" }}>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#7b90b8" }}>Batas Waktu (Deadline)</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"} />
          </div>
          {error && <p className="text-xs" style={{ color: "#ff4d6d" }}>{error}</p>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#7b90b8" }}>
              Batal
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wide"
              style={{ background: "linear-gradient(90deg,#00c8e8 0%,#7c3aed 100%)", color: "#fff", boxShadow: "0 0 18px rgba(0,229,255,0.25)" }}>
              Tambah Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: string; key: ActiveSection }[] = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Calendar,        label: "Jadwal",    key: "jadwal" },
  { icon: ClipboardList,   label: "Tugas",     key: "tugas" },
  { icon: Bell,            label: "Notifikasi",key: "notifikasi" },
  { icon: Settings,        label: "Pengaturan",key: "pengaturan" },
];

function Sidebar({ active, onChange, onLogout }: { active: ActiveSection; onChange: (s: ActiveSection) => void; onLogout: () => void }) {
  return (
    <aside className="flex flex-col items-center py-4 h-full flex-shrink-0"
      style={{ width: 60, background: "rgba(5,10,28,0.90)", borderRight: "1px solid rgba(0,229,255,0.10)", backdropFilter: "blur(20px)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
        style={{ background: "linear-gradient(135deg,rgba(0,229,255,0.2),rgba(179,71,255,0.25))", border: "1px solid rgba(0,229,255,0.4)", boxShadow: "0 0 14px rgba(0,229,255,0.2)" }}>
        <GraduationCap size={16} color="#00e5ff" />
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ icon: Icon, label, key }) => {
          const on = active === key;
          return (
            <div key={key} className="relative flex items-center group">
              {on && <div className="absolute top-1/2 -translate-y-1/2 rounded-r-full" style={{ left: 0, width: 3, height: 26, background: "#00e5ff", boxShadow: "0 0 10px #00e5ff,0 0 20px rgba(0,229,255,0.6)" }} />}
              <button title={label} onClick={() => onChange(key)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ marginLeft: 10, background: on ? "rgba(0,229,255,0.12)" : "transparent", border: on ? "1px solid rgba(0,229,255,0.35)" : "1px solid transparent", boxShadow: on ? "0 0 14px rgba(0,229,255,0.2)" : "none" }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={16} color={on ? "#00e5ff" : "#4a5e82"} style={{ filter: on ? "drop-shadow(0 0 5px rgba(0,229,255,0.7))" : "none" }} />
              </button>
              <div className="absolute left-12 px-2 py-1 rounded-lg text-xs font-semibold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                style={{ background: "rgba(8,18,40,0.95)", border: "1px solid rgba(0,229,255,0.2)", color: "#e8f0fe", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                {label}
              </div>
            </div>
          );
        })}
      </nav>
      <button onClick={onLogout} title="Keluar"
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: "linear-gradient(135deg,#7c3aed,#b347ff)", border: "2px solid rgba(179,71,255,0.4)", boxShadow: "0 0 12px rgba(179,71,255,0.3)" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(179,71,255,0.5)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 12px rgba(179,71,255,0.3)"}>
        <User size={13} color="#fff" />
      </button>
    </aside>
  );
}

// ─── Bottom Nav (mobile) ──────────────────────────────────────────────────────
function BottomNav({ active, onChange }: { active: ActiveSection; onChange: (s: ActiveSection) => void }) {
  return (
    <nav className="flex sm:hidden items-center justify-around py-2 flex-shrink-0"
      style={{ background: "rgba(5,10,28,0.95)", borderTop: "1px solid rgba(0,229,255,0.12)", backdropFilter: "blur(20px)" }}>
      {NAV.map(({ icon: Icon, label, key }) => {
        const on = active === key;
        return (
          <button key={key} onClick={() => onChange(key)} className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all"
            style={{ color: on ? "#00e5ff" : "#4a5e82" }}>
            <Icon size={20} style={{ filter: on ? "drop-shadow(0 0 5px rgba(0,229,255,0.7))" : "none" }} />
            <span className="text-xs font-semibold" style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <GlassCard className="flex flex-col justify-between p-3 sm:p-4" style={{ minHeight: 76 }}>
      <span className="font-black leading-none" style={{ fontSize: "clamp(1.1rem,3vw,1.5rem)", fontFamily: "'Exo 2',sans-serif", background: accent ? "linear-gradient(90deg,#00e5ff,#b347ff)" : "linear-gradient(90deg,#e8f0fe,#9ab2d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {value}
      </span>
      <span className="text-xs font-medium leading-tight" style={{ color: "#7b90b8", fontSize: "0.7rem" }}>{label}</span>
    </GlassCard>
  );
}

// ─── Section: Jadwal ──────────────────────────────────────────────────────────
function JadwalSection() {
  const [activeDay, setActiveDay] = useState<string>("Senin");
  const classes = SCHEDULE[activeDay] ?? [];
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 overflow-y-auto flex-1">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base sm:text-lg" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Jadwal Kuliah</h2>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00e5ff" }}>
          {Object.values(SCHEDULE).flat().length} Kelas/Minggu
        </span>
      </div>
      {/* Day tabs — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setActiveDay(d)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
            style={{ background: activeDay === d ? "rgba(0,229,255,0.14)" : "rgba(255,255,255,0.04)", border: activeDay === d ? "1px solid rgba(0,229,255,0.35)" : "1px solid rgba(0,229,255,0.08)", color: activeDay === d ? "#00e5ff" : "#4a5e82", boxShadow: activeDay === d ? "0 0 12px rgba(0,229,255,0.15)" : "none" }}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {classes.length === 0
          ? <div className="flex items-center justify-center h-28 rounded-2xl text-sm" style={{ color: "#4a5e82", border: "1px dashed rgba(0,229,255,0.1)" }}>Tidak ada kelas hari ini 🎉</div>
          : classes.map((c, i) => {
            const col = CLASS_COLORS[c.color];
            return (
              <div key={i} className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: col.bg, border: `1px solid ${col.border}` }}>
                <div className="w-1 rounded-full flex-shrink-0" style={{ height: 52, background: col.text, boxShadow: `0 0 8px ${col.text}` }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm leading-snug" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>{c.name}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs" style={{ color: "#7b90b8" }}>
                    <span className="flex items-center gap-1"><Clock size={11} />{c.time}</span>
                    <span className="px-2 py-0.5 rounded font-bold" style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text, fontFamily: "'JetBrains Mono',monospace" }}>{c.room}</span>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── Section: Semua Tugas ─────────────────────────────────────────────────────
function TugasSection({ tasks, setTasks, showModal, setShowModal }: {
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  showModal: boolean; setShowModal: (v: boolean) => void;
}) {
  function toggle(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id: number) { setTasks(prev => prev.filter(t => t.id !== id)); }
  function addTask(t: Omit<Task, "id" | "done">) {
    setTasks(prev => [...prev, { ...t, id: Date.now(), done: false }]);
  }

  const sorted = [...tasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  const pending = sorted.filter(t => !t.done);
  const done = sorted.filter(t => t.done);

  function TaskCard({ t }: { t: Task }) {
    const d = daysUntil(t.deadline);
    const urgent = d <= 1 && !t.done;
    const warn = d <= 3 && d > 1 && !t.done;
    const labelColor = t.done ? "#4a5e82" : urgent ? "#ff4d6d" : warn ? "#fbbf24" : "#00e5ff";
    return (
      <div className="rounded-xl p-3.5 flex items-center gap-3 transition-all"
        style={{ background: t.done ? "rgba(255,255,255,0.03)" : urgent ? "rgba(255,77,109,0.06)" : "rgba(0,229,255,0.04)", border: `1px solid ${t.done ? "rgba(255,255,255,0.06)" : urgent ? "rgba(255,77,109,0.22)" : "rgba(0,229,255,0.13)"}`, opacity: t.done ? 0.6 : 1 }}>
        <CircleCountdown days={d} urgent={urgent} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight" style={{ color: t.done ? "#4a5e82" : "#e8f0fe", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: "#7b90b8" }}>{t.subject}</div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs" style={{ color: labelColor, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem" }}>
              {t.done ? "✓ Selesai" : d <= 0 ? "Sudah Lewat!" : d === 1 ? "▲ H-1 MENDESAK" : `${formatDate(t.deadline)}`}
            </span>
            {urgent && !t.done && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,77,109,0.18)", border: "1px solid rgba(255,77,109,0.4)", color: "#ff4d6d", fontSize: "0.6rem", fontWeight: 700 }}>
                <AlertTriangle size={8} />MENDESAK
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button onClick={() => toggle(t.id)} className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
            title={t.done ? "Tandai belum selesai" : "Tandai selesai"}
            style={{ background: t.done ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)", border: t.done ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.1)", color: t.done ? "#34d399" : "#7b90b8" }}>
            <CheckCircle size={13} />
          </button>
          <button onClick={() => remove(t.id)} className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "#4a5e82" }}
            onMouseEnter={e => e.currentTarget.style.color = "#ff4d6d"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a5e82"}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
      <div className="flex flex-col gap-4 p-4 sm:p-5 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base sm:text-lg" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Semua Tugas</h2>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,229,255,0.1)"}>
            <Plus size={13} />Tambah Tugas
          </button>
        </div>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16">
            <ClipboardList size={40} color="#1e2d4a" />
            <p className="text-sm" style={{ color: "#4a5e82" }}>Belum ada tugas. Tambah tugas pertamamu!</p>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(90deg,#00c8e8,#7c3aed)", color: "#fff", boxShadow: "0 0 18px rgba(0,229,255,0.2)" }}>
              <Plus size={14} />Tambah Tugas
            </button>
          </div>
        )}
        {pending.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5e82" }}>Belum Selesai · {pending.length}</p>
            {pending.map(t => <TaskCard key={t.id} t={t} />)}
          </div>
        )}
        {done.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5e82" }}>Selesai · {done.length}</p>
            {done.map(t => <TaskCard key={t.id} t={t} />)}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Section: Notifikasi ──────────────────────────────────────────────────────
function NotifikasiSection({ tasks }: { tasks: Task[] }) {
  const urgent = tasks.filter(t => !t.done && daysUntil(t.deadline) <= 3).sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 overflow-y-auto flex-1">
      <h2 className="font-bold text-base sm:text-lg" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Notifikasi</h2>
      {urgent.length === 0
        ? <div className="flex flex-col items-center justify-center flex-1 gap-2 py-16"><Bell size={36} color="#1e2d4a" /><p className="text-sm" style={{ color: "#4a5e82" }}>Tidak ada notifikasi mendesak 👍</p></div>
        : urgent.map(t => {
          const d = daysUntil(t.deadline);
          const isH1 = d <= 1;
          return (
            <div key={t.id} className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: isH1 ? "rgba(255,77,109,0.07)" : "rgba(251,191,36,0.06)", border: `1px solid ${isH1 ? "rgba(255,77,109,0.28)" : "rgba(251,191,36,0.28)"}` }}>
              <BellRing size={18} color={isH1 ? "#ff4d6d" : "#fbbf24"} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: isH1 ? "#ff4d6d" : "#fbbf24" }}>
                  {d <= 0 ? "Sudah Lewat!" : `H-${d} ${isH1 ? "MENDESAK" : "SEGERA"}`}
                </p>
                <p className="font-semibold text-sm" style={{ color: "#e8f0fe" }}>{t.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#7b90b8" }}>{t.subject} · {formatDate(t.deadline)}</p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── Section: Pengaturan ──────────────────────────────────────────────────────
function PengaturanSection({ onLogout }: { onLogout: () => void }) {
  const fields = [
    { label: "Nama Lengkap", val: "Reni Safitri" },
    { label: "NIM", val: "101230072" },
    { label: "Program Studi", val: "Teknologi Informasi" },
    { label: "Semester", val: "6" },
    { label: "Email", val: "reni.safitri@student.utn.ac.id" },
  ];
  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 overflow-y-auto flex-1">
      <h2 className="font-bold text-base sm:text-lg" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Pengaturan Akun</h2>
      {fields.map(f => (
        <GlassCard key={f.label} className="p-4 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest flex-shrink-0" style={{ color: "#7b90b8" }}>{f.label}</span>
          <span className="text-sm font-medium text-right" style={{ color: "#e8f0fe" }}>{f.val}</span>
        </GlassCard>
      ))}
      <button onClick={onLogout} className="mt-3 w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all"
        style={{ background: "rgba(255,77,109,0.12)", border: "1px solid rgba(255,77,109,0.35)", color: "#ff4d6d" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,77,109,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,77,109,0.12)"}>
        Keluar dari Akun
      </button>
    </div>
  );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardSection({ tasks, setTasks, setSection, showModal, setShowModal }: {
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSection: (s: ActiveSection) => void;
  showModal: boolean; setShowModal: (v: boolean) => void;
}) {
  const [activeDay, setActiveDay] = useState<string>("Selasa");
  const classes = SCHEDULE[activeDay] ?? [];

  function addTask(t: Omit<Task, "id" | "done">) {
    setTasks(prev => [...prev, { ...t, id: Date.now(), done: false }]);
  }

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);
  const totalCount = tasks.length;
  const doneCount = doneTasks.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const upcomingTasks = [...pendingTasks]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  return (
    <>
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
        {/* metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <MetricCard value="7" label="Mata Kuliah" />
          <MetricCard value="22" label="Kredit SKS" accent />
          <MetricCard value="3.72" label="Rata-rata IPK" />
          <MetricCard value="Ke-11/16" label="Minggu" accent />
        </div>

        {/* main grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {/* Jadwal */}
          <GlassCard className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Jadwal Kuliah</span>
              <button onClick={() => setSection("jadwal")} className="text-xs flex items-center gap-1 transition-colors" style={{ color: "#7b90b8" }}
                onMouseEnter={e => e.currentTarget.style.color = "#00e5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "#7b90b8"}>
                Lihat semua <ChevronRight size={11} />
              </button>
            </div>
            {/* day tabs */}
            <div className="flex gap-1 p-0.5 rounded-xl overflow-x-auto" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.08)", scrollbarWidth: "none" }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setActiveDay(d)}
                  className="flex-shrink-0 flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all relative"
                  style={{ background: activeDay === d ? "rgba(0,229,255,0.14)" : "transparent", color: activeDay === d ? "#00e5ff" : "#4a5e82", border: activeDay === d ? "1px solid rgba(0,229,255,0.3)" : "1px solid transparent" }}>
                  {d.slice(0, 3)}
                  {activeDay === d && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "#00e5ff", boxShadow: "0 0 5px #00e5ff" }} />}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2" style={{ maxHeight: 200, overflowY: "auto" }}>
              {classes.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: "#4a5e82" }}>Tidak ada kelas hari ini</div>
                : classes.map((c, i) => {
                  const col = CLASS_COLORS[c.color];
                  return (
                    <div key={i} className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: col.bg, border: `1px solid ${col.border}` }}>
                      <div className="w-0.5 h-10 rounded-full flex-shrink-0" style={{ background: col.text, boxShadow: `0 0 6px ${col.text}` }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-snug" style={{ color: "#e8f0fe" }}>{c.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: "#7b90b8" }}>
                          <Clock size={10} />{c.time}
                          <span className="ml-1 font-bold" style={{ color: col.text, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem" }}>{c.room}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </GlassCard>

          {/* Tugas */}
          <GlassCard className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Daftar Tugas</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,229,255,0.1)"}>
                  <Plus size={11} />Tambah
                </button>
                <button onClick={() => setSection("tugas")} className="text-xs flex items-center gap-1 transition-colors" style={{ color: "#7b90b8" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#00e5ff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#7b90b8"}>
                  Semua <ChevronRight size={11} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2" style={{ maxHeight: 230, overflowY: "auto" }}>
              {upcomingTasks.length === 0
                ? <div className="text-center py-8 text-xs" style={{ color: "#4a5e82" }}>Belum ada tugas aktif</div>
                : upcomingTasks.map(t => {
                  const d = daysUntil(t.deadline);
                  const urgent = d <= 1;
                  return (
                    <div key={t.id} className="rounded-xl p-3 flex items-center gap-2.5 transition-all"
                      style={{ background: urgent ? "rgba(255,77,109,0.06)" : "rgba(0,229,255,0.04)", border: `1px solid ${urgent ? "rgba(255,77,109,0.22)" : "rgba(0,229,255,0.12)"}` }}>
                      <CircleCountdown days={d} urgent={urgent} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-tight truncate" style={{ color: "#e8f0fe" }}>{t.title}</div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: "#7b90b8" }}>{t.subject}</div>
                        {urgent && (
                          <span className="text-xs font-bold" style={{ color: "#ff4d6d", fontSize: "0.6rem" }}>▲ H-1 MENDESAK</span>
                        )}
                      </div>
                    </div>
                  );
                })
              }
            </div>
            {/* progress bar */}
            <div className="flex flex-col gap-1.5 pt-1" style={{ borderTop: "1px solid rgba(0,229,255,0.08)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "#7b90b8" }}>
                <span>Progres</span>
                <span className="font-bold" style={{ color: "#00e5ff", fontFamily: "'JetBrains Mono',monospace" }}>{doneCount}/{totalCount}</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#00e5ff,#b347ff)", boxShadow: "0 0 8px rgba(0,229,255,0.4)", transition: "width 0.6s ease" }} />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "#7b90b8" }}>
                <span style={{ color: "#00e5ff", fontWeight: 600 }}>{pct}% selesai</span>
                <span>{totalCount - doneCount} tersisa</span>
              </div>
            </div>
          </GlassCard>

          {/* Motivasi */}
          <GlassCard className="p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute pointer-events-none" style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(179,71,255,0.12) 0%,transparent 70%)", top: -40, right: -30 }} />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(179,71,255,0.2),rgba(0,229,255,0.15))", border: "1px solid rgba(179,71,255,0.4)" }}>
                <Flame size={13} color="#b347ff" style={{ filter: "drop-shadow(0 0 5px #b347ff)" }} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b347ff", letterSpacing: "0.14em" }}>Motivasi Harian</span>
            </div>
            <blockquote className="relative z-10 text-sm leading-relaxed italic flex-1" style={{ color: "#c8d8f0" }}>
              "Seorang pakar dalam hal apa pun dulunya adalah seorang pemula yang menolak untuk menyerah."
            </blockquote>
            <p className="text-xs font-semibold relative z-10" style={{ color: "#7b90b8" }}>— Helen Hayes</p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────────
function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Makalah E-Government Kota Bandung", subject: "E-Government dan Kota Cerdas", deadline: "2026-06-10", done: true },
    { id: 2, title: "Presentasi Proposal Proyek Akhir", subject: "Pengelolaan Proyek Teknologi Informasi", deadline: "2026-06-12", done: true },
    { id: 3, title: "Kuis Mingguan Komputasi Awan", subject: "Komputasi Awan", deadline: "2026-06-14", done: true },
    { id: 4, title: "Resume Jurnal Kewirausahaan", subject: "Kewirausahaan Teknologi", deadline: "2026-06-15", done: true },
    { id: 5, title: "Laporan Akhir Konsep Arsitektur", subject: "Konsep Arsitektur dan Perusahaan Sistem 1", deadline: "2026-06-22", done: false },
    { id: 6, title: "Prototipe Sensor IoT", subject: "Aplikasi Internet of Things", deadline: "2026-06-23", done: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const now = useNow();

  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const sectionLabel: Record<ActiveSection, string> = {
    dashboard: "Dashboard", jadwal: "Jadwal Kuliah",
    tugas: "Semua Tugas", notifikasi: "Notifikasi", pengaturan: "Pengaturan",
  };

  const h1Tasks = tasks.filter(t => !t.done && daysUntil(t.deadline) === 1);
  const showToast = !toastDismissed && h1Tasks.length > 0;

  function renderContent() {
    switch (activeSection) {
      case "dashboard": return <DashboardSection tasks={tasks} setTasks={setTasks} setSection={setActiveSection} showModal={showModal} setShowModal={setShowModal} />;
      case "jadwal":    return <JadwalSection />;
      case "tugas":     return <TugasSection tasks={tasks} setTasks={setTasks} showModal={showModal} setShowModal={setShowModal} />;
      case "notifikasi":return <NotifikasiSection tasks={tasks} />;
      case "pengaturan":return <PengaturanSection onLogout={onLogout} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "radial-gradient(ellipse 110% 80% at 20% 40%,#080f2a 0%,#050d1a 50%,#020810 100%)", fontFamily: "'Inter','Exo 2',sans-serif" }}>
      {showToast && <DeadlineToast tasks={tasks} onClose={() => setToastDismissed(true)} />}

      {/* Sidebar — hidden on mobile */}
      <div className="hidden sm:flex">
        <Sidebar active={activeSection} onChange={setActiveSection} onLogout={onLogout} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,229,255,0.08)", background: "rgba(5,10,28,0.7)", backdropFilter: "blur(14px)" }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold truncate" style={{ fontSize: "clamp(0.95rem,3vw,1.15rem)", color: "#e8f0fe", fontFamily: "'Exo 2',sans-serif" }}>Halo, Reni Safitri! 👋</span>
              <span className="hidden sm:inline text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00e5ff" }}>Semester 6 &bull; Teknologi Informasi</span>
            </div>
            <p className="text-xs font-semibold tracking-widest mt-0.5" style={{ color: "#b347ff", letterSpacing: "0.12em" }}><span style={{ color: "#00e5ff" }}>✦</span> ONE STEP FOR GRADUATION!</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.14)", minWidth: 180 }}>
              <Search size={13} color="#4a5e82" />
              <input className="bg-transparent outline-none text-sm w-full" placeholder="Cari tugas, mata kuliah..." style={{ color: "#e8f0fe" }} />
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold" style={{ color: "#7b90b8", fontFamily: "'JetBrains Mono',monospace" }}>{dateStr}</div>
              <div className="font-bold" style={{ color: "#00e5ff", fontFamily: "'JetBrains Mono',monospace", fontSize: "1rem" }}>{timeStr}</div>
            </div>
            {/* notif bell on mobile */}
            <button className="sm:hidden relative" onClick={() => setActiveSection("notifikasi")}>
              <Bell size={20} color={h1Tasks.length > 0 ? "#ff4d6d" : "#4a5e82"} />
              {h1Tasks.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#ff4d6d", color: "#fff", fontSize: "0.55rem" }}>{h1Tasks.length}</span>}
            </button>
          </div>
        </header>

        {/* section breadcrumb */}
        <div className="px-4 sm:px-6 py-2 flex-shrink-0 hidden sm:flex items-center" style={{ borderBottom: "1px solid rgba(0,229,255,0.06)" }}>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4a5e82" }}>{sectionLabel[activeSection]}</span>
        </div>

        {/* content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {renderContent()}
        </div>

        {/* Bottom Nav — mobile only */}
        <BottomNav active={activeSection} onChange={setActiveSection} />
      </div>
    </div>
  );
}

// ─── LoginPage ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const [nim, setNim] = useState("101230072");
  const [pass, setPass] = useState("TF23C");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% 60%,#0a0f2e 0%,#050d1a 55%,#020810 100%)", fontFamily: "'Exo 2','Inter',sans-serif" }}>
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(179,71,255,0.14) 0%,transparent 70%)", top: -120, left: -80 }} />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,255,0.10) 0%,transparent 70%)", bottom: -80, right: -60 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,229,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", letterSpacing: "0.18em" }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#00e5ff", boxShadow: "0 0 6px #00e5ff" }} />
            PORTAL AKADEMIK
          </div>
        </div>

        <GlassCard neon className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(179,71,255,0.20))", border: "1px solid rgba(0,229,255,0.35)", boxShadow: "0 0 20px rgba(0,229,255,0.2)" }}>
              <GraduationCap size={28} color="#00e5ff" />
            </div>
            <h1 className="text-center font-bold tracking-widest" style={{ fontSize: "0.95rem", color: "#e8f0fe", letterSpacing: "0.15em" }}>SISTEM INFORMASI</h1>
            <span className="text-center font-black tracking-widest mt-0.5" style={{ fontSize: "1.5rem", background: "linear-gradient(90deg,#00e5ff,#b347ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.2em" }}>TF23C</span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#7b90b8" }}>Nomor Induk Mahasiswa</label>
              <input type="text" value={nim} onChange={e => setNim(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,229,255,0.2)", color: "#e8f0fe", fontFamily: "'JetBrains Mono',monospace" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(0,229,255,0.15)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; e.currentTarget.style.boxShadow = "none"; }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#7b90b8" }}>Kata Sandi</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,229,255,0.2)", color: "#e8f0fe", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.12em" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.6)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(0,229,255,0.15)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; e.currentTarget.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#7b90b8" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl py-3.5 font-bold text-sm tracking-widest uppercase mt-1"
              style={{ background: loading ? "rgba(0,229,255,0.3)" : "linear-gradient(90deg,#00c8e8,#7c3aed)", color: loading ? "rgba(255,255,255,0.5)" : "#fff", letterSpacing: "0.15em", boxShadow: loading ? "none" : "0 0 24px rgba(0,229,255,0.3),0 4px 16px rgba(0,0,0,0.4)" }}>
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
          <div className="text-center mt-4">
            <button className="text-xs" style={{ color: "#7b90b8" }}
              onMouseEnter={e => e.currentTarget.style.color = "#00e5ff"}
              onMouseLeave={e => e.currentTarget.style.color = "#7b90b8"}>
              Lupa Kata Sandi?
            </button>
          </div>
        </GlassCard>
        <p className="text-center text-xs mt-5" style={{ color: "rgba(123,144,184,0.45)" }}>Universitas Teknologi Nusantara &copy; 2026</p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("login");
  return (
    <div className="dark size-full">
      {page === "login"
        ? <LoginPage onLogin={() => setPage("dashboard")} />
        : <DashboardPage onLogout={() => setPage("login")} />
      }
    </div>
  );
}
