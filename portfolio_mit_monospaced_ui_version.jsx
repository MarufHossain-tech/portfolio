// Monospaced UI version
// What changed:
// 1) Applied a global monospaced look using Tailwind's font-mono on the top-level wrapper.
// 2) Added tabular-nums to stabilize numbers like scores and dates.
// 3) Kept all layouts intact. No other visual changes.

import React, { useMemo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  BookOpen,
  School,
  Award,
  Briefcase,
  Satellite,
  Waves,
  Brain,
  Cpu,
  LineChart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// =====================
// MIT Brand palette only
// =====================
const MIT = {
  red: "#A31F34",
  gray: "#8A8B8C",
  silver: "#C2C0BF",
  coal: "#222222",
  jet: "#111111",
  white: "#FFFFFF",
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-32 relative py-8 md:py-12">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="h-full w-full opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: MIT.white }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <p className="mt-2 text-sm md:text-base" style={{ color: MIT.silver }}>
            {subtitle}
          </p>
        )}
        <div className="mt-8 relative z-10">{children}</div>
      </div>
    </section>
  );
}

// =====================
// GALAXY BACKGROUND with PLANET SCENES
// =====================
function GalaxyBackground({ sceneKey }) {
  const ref = useRef(null);
  const animRef = useRef();
  const state = useRef({ t: 0, current: null, target: null, stars: [] });

  const SCENE_PRESETS = useMemo(
    () => ({
      hero: { planetR: 70, orbitR: 160, speed: 0.12, color: MIT.red, ring: MIT.silver },
      about: { planetR: 60, orbitR: 180, speed: 0.1, color: MIT.gray, ring: MIT.white },
      interests: { planetR: 80, orbitR: 200, speed: 0.08, color: MIT.silver, ring: MIT.gray },
      featured: { planetR: 72, orbitR: 220, speed: 0.09, color: MIT.white, ring: MIT.red },
      skills: { planetR: 64, orbitR: 190, speed: 0.11, color: MIT.gray, ring: MIT.silver },
      experience: { planetR: 76, orbitR: 210, speed: 0.07, color: MIT.red, ring: MIT.white },
      publications: { planetR: 68, orbitR: 230, speed: 0.085, color: MIT.silver, ring: MIT.gray },
      grants: { planetR: 62, orbitR: 185, speed: 0.105, color: MIT.white, ring: MIT.red },
      teaching: { planetR: 74, orbitR: 205, speed: 0.095, color: MIT.gray, ring: MIT.silver },
      awards: { planetR: 66, orbitR: 175, speed: 0.115, color: MIT.white, ring: MIT.gray },
      contact: { planetR: 70, orbitR: 200, speed: 0.09, color: MIT.red, ring: MIT.silver },
    }),
    []
  );

  const lerp = (a, b, f) => a + (b - a) * f;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      if (!state.current.stars.length) {
        const N = 140;
        state.current.stars = Array.from({ length: N }).map(() => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.4 + 0.4) * dpr,
          a: Math.random() * Math.PI * 2,
          s: 0.2 + Math.random() * 0.6,
        }));
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (!state.current.current) {
      const init = SCENE_PRESETS.hero;
      state.current.current = { ...init, theta: 0 };
      state.current.target = { ...init };
    }

    const mixColor = (c1, c2, f) => {
      const a = parseInt(c1.slice(1), 16);
      const b = parseInt(c2.slice(1), 16);
      const r = Math.round(lerp((a >> 16) & 255, (b >> 16) & 255, f));
      const g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, f));
      const bl = Math.round(lerp(a & 255, b & 255, f));
      return `rgb(${r},${g},${bl})`;
    };

    const draw = () => {
      const { current, target, stars } = state.current;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      stars.forEach((s) => {
        s.a += 0.002 * s.s;
        const twinkle = 0.6 + Math.sin(s.a) * 0.4;
        ctx.globalAlpha = 0.35 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      current.planetR = lerp(current.planetR, target.planetR, 0.02);
      current.orbitR = lerp(current.orbitR, target.orbitR, 0.02);
      current.speed = lerp(current.speed, target.speed, 0.05);

      const color = mixColor(target.color, current.color || target.color, 0.3);
      const ringCol = mixColor(target.ring, current.ring || target.ring, 0.3);
      current.color = color;
      current.ring = ringCol;

      current.theta += 0.002 * current.speed;
      const cx = w * 0.7;
      const cy = h * 0.25;

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.ellipse(cx, cy, current.orbitR, current.orbitR * 0.66, 0, 0, Math.PI * 2);
      ctx.stroke();

      const px = cx + Math.cos(current.theta) * current.orbitR;
      const py = cy + Math.sin(current.theta) * current.orbitR * 0.66;

      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * Math.PI * 2 + current.theta * 0.5;
        const rr = current.planetR * 1.6 + Math.sin(i + current.theta) * 2;
        const rx = px + Math.cos(ang) * rr;
        const ry = py + Math.sin(ang) * rr * 0.6;
        const grd = ctx.createRadialGradient(rx, ry, 0, rx, ry, 6 * dpr);
        grd.addColorStop(0, current.ring);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      const pg = ctx.createRadialGradient(
        px - current.planetR * 0.4,
        py - current.planetR * 0.4,
        0,
        px,
        py,
        current.planetR * 1.4
      );
      pg.addColorStop(0, "rgba(255,255,255,0.8)");
      pg.addColorStop(1, current.color);
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(px, py, current.planetR, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [SCENE_PRESETS]);

  useEffect(() => {
    const presets = {
      hero: "hero",
      about: "about",
      interests: "interests",
      featured: "featured",
      skills: "skills",
      experience: "experience",
      publications: "publications",
      grants: "grants",
      teaching: "teaching",
      awards: "awards",
      contact: "contact",
    };
    const k = presets[sceneKey] || "hero";
    state.current.target = { ...state.current.target, ...SCENE_PRESETS[k] };
  }, [sceneKey, SCENE_PRESETS]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 -z-10"
      style={{ background: `linear-gradient(180deg, ${MIT.jet}, ${MIT.coal})` }}
      aria-hidden
    />
  );
}

function CursorHalo() {
  const ref = useRef(null);
  const raf = useRef();
  const pos = useRef({ x: -1e4, y: -1e4 });
  const smooth = useRef({ x: -1e4, y: -1e4 });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = (canvas.width = Math.floor(window.innerWidth * dpr));
      h = (canvas.height = Math.floor(window.innerHeight * dpr));
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e) => {
      pos.current.x = e.clientX * dpr;
      pos.current.y = e.clientY * dpr;
    };
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.12;
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.12;
      const r = 26 * (dpr || 1);
      const g = ctx.createRadialGradient(
        smooth.current.x,
        smooth.current.y,
        0,
        smooth.current.x,
        smooth.current.y,
        r * 2.2
      );
      g.addColorStop(0, `${MIT.red}44`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(smooth.current.x, smooth.current.y, r, 0, Math.PI * 2);
      ctx.fill();
      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-[60] mix-blend-screen opacity-70"
      aria-hidden
    />
  );
}

function NavRain() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, cols, y;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      const height = Math.max(54, rect.height);
      w = (canvas.width = Math.floor(rect.width * dpr));
      h = (canvas.height = Math.floor(height * dpr));
      canvas.style.width = rect.width + "px";
      canvas.style.height = height + "px";
      cols = Math.floor(w / (12 * dpr));
      y = Array(cols).fill(0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = MIT.gray;
      ctx.font = `${14 * (dpr || 1)}px monospace`;
      for (let i = 0; i < y.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 12 * (dpr || 1);
        ctx.fillText(text, x, y[i] * 18 * (dpr || 1));
        if (y[i] * 18 * (dpr || 1) > h && Math.random() > 0.975) y[i] = 0;
        y[i]++;
      }
      requestAnimationFrame(draw);
    };
    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 opacity-40" aria-hidden />;
}

function Pill({ children }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs border mr-2 mb-2 inline-flex items-center"
      style={{ borderColor: MIT.silver, color: MIT.silver }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 md:p-6 border backdrop-blur-sm ${className}`}
      style={{ borderColor: "#2b2b2b", background: "rgba(10,10,10,0.55)" }}
    >
      {children}
    </div>
  );
}

const NAV = [
  { id: "about", label: "About" },
  { id: "interests", label: "Research" },
  { id: "featured", label: "Featured" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "grants", label: "Grants" },
  { id: "teaching", label: "Teaching" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

const person = {
  name: "Md Maruf Hossain Tasin",
  location: "Dhaka, Bangladesh",
  email: "mdmarufhossaintasin@gmail.com",
  links: {
    linkedin: "http://www.linkedin.com/in/marufhossaintasin",
    github: "https://github.com/MarufHossain-tech",
    scholar: "https://scholar.google.com/citations?user=ONXskv0AAAAJ&hl=en",
  },
  tagline: "PhD Research Enthusiast.",
  avatar: "/profile.jpg",
  about:
    "Research-focused EEE graduate working on decentralized hybrid renewables, nanosatellite EPS, and lead‑free perovskites. Interests span IoT, control, techno‑economics, and photonics‑based comms.",
};

const interests = [
  "Renewable Energy",
  "IoT",
  "Decentralized Intelligent Systems",
  "Nano-Energy Harvesters",
  "Electrical Power System Design",
  "Photonics-based Comms",
];

const skills = {
  programming: [
    { k: "Python", v: 80 },
    { k: "MATLAB/Simulink", v: 85 },
    { k: "C/C++", v: 65 },
    { k: "Rust", v: 35 },
  ],
  design: [
    { k: "Homer Pro", v: 85 },
    { k: "PowerSim", v: 70 },
    { k: "Proteus", v: 75 },
    { k: "COMSOL", v: 65 },
    { k: "SCAPS-1D", v: 60 },
  ],
  hardware: [
    { k: "Arduino", v: 80 },
    { k: "Raspberry Pi", v: 75 },
    { k: "ESP", v: 65 },
    { k: "Sensors/DAQ", v: 70 },
  ],
  research: [
    { k: "Docker/Git/LaTeX", v: 70 },
    { k: "Tech Writing", v: 80 },
    { k: "Grant Writing", v: 70 },
    { k: "Leadership/Mentoring", v: 80 },
  ],
};

const radar = [
  { key: "Modeling", v: 85 },
  { key: "Simulation", v: 90 },
  { key: "Hardware", v: 75 },
  { key: "Algorithms", v: 70 },
  { key: "Tech Writing", v: 80 },
  { key: "Mentoring", v: 80 },
];

const featured = [
  {
    title: "2U Nanosatellite EPS + Optical Downlink",
    tag: "AUST Nanosatellite Lab",
    bullets: ["EPS and MPPT", "ROS optical downlink", "Vision on Xilinx Arty A7"],
  },
  {
    title: "AQUALUNG AUV",
    tag: "Underwater Robotics",
    bullets: ["Raspberry Pi backbone", "Underwater kill switch", "YOLO CV pipeline"],
  },
  {
    title: "Riverine Hybrid Renewable Platform",
    tag: "Decentralized Energy",
    bullets: ["Homer Pro TEA", "CFD via COMSOL", "Sediment + solar cleaning"],
  },
  {
    title: "Lead‑Free Perovskite with RGO Contacts",
    tag: "Photovoltaics",
    bullets: ["SCAPS-1D + COMSOL", "Work-function tuning", "PCE 21.23% (sim)"]
  },
  {
    title: "IoDPS Patent Manuscript",
    tag: "Intelligent Power Module",
    bullets: ["Decentralized control", "Hybrid storage", "Target filing Dec 2025"],
  },
  {
    title: "DeSmES Lab Simulator",
    tag: "Open-source Tooling",
    bullets: ["Techno-economic analysis", "MIT-style license", "Web based"],
  },
];

function SDGSquaresUploadable({ goals, size = 84 }) {
  const [icons, setIcons] = useState(Array(goals.length).fill(null));
  const fileRef = useRef(null);

  const onPick = (e) => {
    const files = Array.from(e.target.files || []);
    const next = [...icons];
    files.slice(0, goals.length).forEach((f, i) => (next[i] = URL.createObjectURL(f)));
    setIcons(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {goals.map((g, i) => (
          <div
            key={g.id}
            className="rounded-xl border flex flex-col items-center justify-center px-2 py-2 text-center"
            style={{ borderColor: "#2b2b2b", background: `${MIT.red}10`, height: size }}
            title={`SDG ${g.id}: ${g.label}`}
          >
            <div
              className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center border"
              style={{ borderColor: "#2b2b2b", background: icons[i] ? "transparent" : MIT.red }}
            >
              {icons[i] ? (
                <img src={icons[i]} alt={g.label} className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs font-bold" style={{ color: MIT.white }}>{`SDG ${g.id}`}</div>
              )}
            </div>
            <div className="mt-2 text-[11px] leading-tight" style={{ color: MIT.silver }}>
              {g.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="px-2.5 py-1.5 rounded-md text-xs border"
          style={{ borderColor: MIT.red, background: `${MIT.red}22`, color: MIT.white }}
        >
          Upload SDG icons
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
        <div className="text-[11px] opacity-70" style={{ color: MIT.silver }}>
          Tip: provide 6 square PNG/SVG files for symmetry.
        </div>
      </div>
    </div>
  );
}

function MediaStrip({ images = [] }) {
  if (!images.length) return null;
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {images.slice(0, 6).map((src, i) => (
        <div key={i} className="aspect-video rounded-lg overflow-hidden border" style={{ borderColor: "#262626" }}>
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${MIT.red}33, ${MIT.gray}22)` }}/>
        </div>
      ))}
    </div>
  );
}

function Expandable({ title, subtitle, preview, details, images = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button className="w-full text-left" onClick={() => setOpen((s) => !s)} aria-expanded={open}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{title}</div>
            {subtitle && <div className="text-sm opacity-80">{subtitle}</div>}
          </div>
          <ChevronDown className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`} size={18} />
        </div>
        {preview}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pt-4 border-t mt-4" style={{ borderColor: "#2b2b2b" }}>
              {details}
              <MediaStrip images={images} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function IconRow({ icons }) {
  return (
    <div className="flex gap-2 opacity-70">
      {icons.map((I, idx) => (
        <I key={idx} size={16} />
      ))}
    </div>
  );
}

export default function PortfolioMIT() {
  const [active, setActive] = useState("hero");
  const containerRef = useRef(null);

  useEffect(() => {
    const ids = ["about", "interests", "featured", "skills", "experience", "publications", "grants", "teaching", "awards", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const researchExp = [
    {
      org: "BRAC University",
      role: "Research Assistant (Part-time, 15 h/wk)",
      period: "Oct 2024 – Present",
      icons: [Waves, Brain],
      bullets: [
        "Decentralized riverine hybrid renewables; microelectronics for smart management",
        "TEA in HOMER Pro; CFD in COMSOL",
        "Outcome: under review at Energy Reports",
      ],
      images: ["brac-1", "brac-2", "brac-3"],
      long:
        "Built a co-optimized scheduling strategy for PV+hydrokinetic+storage. Addressed fluctuating water levels, sedimentation, and PV soiling via control and maintenance windows.",
    },
    {
      org: "McGill University (Remote)",
      role: "Research Assistant (Part-time, 15 h/wk)",
      period: "Oct 2024 – Present",
      icons: [Cpu, LineChart],
      bullets: [
        "Lead-free perovskite with reduced graphene oxide back-contact",
        "SCAPS-1D + COMSOL twins; work-function sweep",
        "PCE 21.23% in sim; JPCS under review",
      ],
      images: ["mcgill-1", "mcgill-2"],
      long:
        "Investigated contact energetics and transport layers. Simulated optical-electrical coupling to estimate achievable device stack efficiency.",
    },
    {
      org: "AUST Nanosatellite Communication Lab",
      role: "Research Assistant",
      period: "Dec 2023 – Oct 2024",
      icons: [Satellite, Brain],
      bullets: [
        "Built EPS and MPPT",
        "Optical downlink via ROS; vision on Arty A7 + OpenCV",
        "ICICT 2024 paper; Daily SAMAKAL feature",
      ],
      images: ["austsat-1", "austsat-2", "austsat-3", "austsat-4"],
      long:
        "Designed pulsed-load tolerant EPS and prototyped free-space optical link using off-the-shelf components and custom modulation.",
    },
    {
      org: "AUST Rocketry Team",
      role: "Research Intern",
      period: "Jul 2022 – Jul 2023",
      icons: [Cpu, Brain],
      bullets: [
        "Solid-fuel stack for Bijoy‑71",
        "Arduino Mega avionics; faster trigger",
        "Ground station EPS design",
      ],
      images: ["rocket-1", "rocket-2"],
      long:
        "Implemented telemetry and power budgeting for subsonic sounding model rocket effort across multiple static tests.",
    },
  ];

  const professional = [
    {
      org: "Alfatah PowerTech | Alfatah Enterprise",
      role: "Lead Engineer → Design Engineer → Trainee → HVAC Operator",
      period: "Jan 2019 – Jan 2022",
      icons: [Briefcase],
      bullets: [
        "Simulation-driven R&D workflow; −67% dev time",
        "Remodeled PE control in MATLAB; −30% total cost",
        "Emerging Talent of the Year",
      ],
      images: ["alfatah-1", "alfatah-2"],
      long:
        "Owned model-in-the-loop validation and migrated legacy controllers to parameterized MATLAB/Simulink libraries.",
    },
  ];

  const publications = {
    journals_under_review: [
      {
        title:
          "Decentralized Smart Hybrid Renewable Riverine Floating Platform for 140% National Demand by 2030",
        venue: "Energy Reports",
        status: "Under review",
        long:
          "Presents a modular floating platform integrating PV, hydrokinetic turbines, and hybrid storage with predictive maintenance scheduling.",
        links: [
          { label: "Preprint (add later)", href: "#" },
        ],
      },
      {
        title:
          "Design & Performance Analysis of Lead‑Free Perovskite Solar Cells with RGO Contacts",
        venue: "Journal of Physics and Chemistry of Solids",
        status: "Under review",
        long:
          "Evaluates reduced graphene oxide as a back-contact with work-function tuning; demonstrates simulated PCE 21.23%.",
        links: [],
      },
    ],
    manuscripts: [
      {
        title:
          "Co‑Optimized CubeSat EPS Design: Predictive Scheduling with Pulsed Loads",
        venue: "Target: IEEE T-AES",
        status: "In prep",
        long: "Focus on EPS–payload co-scheduling to stabilize bus voltage under pulsed imaging workloads.",
      },
      {
        title:
          "Australian Desert Food+Energy with Modular Nuclear + Agrivoltaics",
        venue: "Target: IEEE/Elsevier",
        status: "In prep",
        long: "Systems analysis for food-energy-water resilience using SMR + agrivoltaic layouts.",
      },
    ],
    conferences: [
      {
        title: "Implementation of the AQUALUNG AUV",
        venue: "IEEE/OES AUV Symposium 2022",
        doi: "10.1109/auv53081.2022.9965924",
        long: "Introduces a compact AUV with acoustic-magnetic kill switch and YOLO-based detection.",
        links: [
          { label: "DOI", href: "https://doi.org/10.1109/auv53081.2022.9965924" },
        ],
      },
      {
        title: "Hybrid Monitoring for Sundarbans Mangrove",
        venue: "ICICT 2024",
        doi: "10.1109/icict64387.2024.10839745",
        long: "Combines satellite imagery with classical CV for mangrove monitoring.",
        links: [
          { label: "DOI", href: "https://doi.org/10.1109/icict64387.2024.10839745" },
        ],
      },
    ],
    chapters: [
      {
        title: "Avionics for Subsonic Sounding Rocket",
        venue: "Springer, 2024",
        status: "Under review",
        long: "Covers avionics architecture and test methodology.",
      },
      {
        title: "Feasibility and Case Studies",
        venue: "Springer, 2024",
        status: "Manuscript",
        long: "Feasibility analysis for low-cost sounding rocket programs.",
      },
    ],
    ip: [
      {
        title: "IoDPS: Decentralized Intelligent Hybrid Power System Module",
        type: "Patent manuscript",
        target: "Dec 2025",
        long: "Modular power module with distributed control for microgrids and spacecraft.",
      },
    ],
  };

  const teaching = [
    {
      org: "NIET, Bangladesh",
      role: "Junior Instructor (Part-time, 12 h/wk)",
      period: "Jul 2025 – Present",
      work: [
        "EE 26761: AC Machines I",
        "EE 26762: T&D of Electrical Power I",
        "EE 26774: Renewable Energy & Power Plant Technology",
      ],
      images: ["niet-1", "niet-2"],
      long: "Prepared outcome-based assessments and labs for rotating machines and RE systems.",
      icons: [School],
    },
    {
      org: "Tree Research Academy",
      role: "Pioneer & Lead Mentor",
      period: "May 2023 – Mar 2024",
      work: [
        "Mentored 67+ undergrads",
        "21/30 finalists; 2 awards; 3 pubs",
      ],
      images: ["tree-1"],
      long: "Weekend research incubator focused on fast-tracking publication skills and reproducible workflows.",
      icons: [GraduationCap],
    },
  ];

  const grants = [
    { name: "Establishment Grant", details: "5‑year, $200K for Nanosatellite & Communication Lab incl. AUSTSAT prototype", year: "2023" },
    { name: "AUST Research & Innovation Grant", details: "$3K for AQUALUNG AUV prototype and field tests", year: "2021" },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-neutral-100 font-mono tabular-nums"
      style={{ background: `linear-gradient(180deg, ${MIT.jet}, ${MIT.coal})` }}
    >
      {/* Backgrounds */}
      <GalaxyBackground sceneKey={active || "hero"} />
      <CursorHalo />

      {/* TOP BAR */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b" style={{ borderColor: "#2b2b2b" }}>
        <div className="relative">
          <NavRain />
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <button
                className="text-sm font-mono tracking-widest"
                onClick={() => { setActive("hero"); scrollToId("hero"); }}
                style={{ color: MIT.silver }}
              >
                Maruf Hossain
              </button>
              <div className="flex gap-2">
                <a href={person.links.github} target="_blank" rel="noreferrer" className="p-2 rounded-full border" style={{ borderColor: "#2b2b2b" }}><Github size={16} /></a>
                <a href={person.links.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full border" style={{ borderColor: "#2b2b2b" }}><Linkedin size={16} /></a>
                <a href={`mailto:${person.email}`} className="p-2 rounded-full border" style={{ borderColor: "#2b2b2b" }}><Mail size={16} /></a>
              </div>
            </div>
            <nav className="mt-2 flex flex-wrap gap-2">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setActive(n.id); scrollToId(n.id); }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${active === n.id ? "" : "opacity-80"}`}
                  style={{
                    borderColor: active === n.id ? MIT.red : "#2b2b2b",
                    color: active === n.id ? MIT.white : MIT.silver,
                    background: active === n.id ? `${MIT.red}22` : "transparent",
                  }}
                >
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 md:pt-24 pb-12 md:pb-20">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="flex md:justify-start">
              <div className="relative">
                <img
                  src={person.avatar}
                  alt={`${person.name} portrait`}
                  className="w-48 h-48 md:w-[22rem] md:h-[22rem] rounded-2xl object-cover border"
                  style={{ borderColor: MIT.red, background: `${MIT.red}11` }}
                />
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: MIT.red, background: `${MIT.red}22` }}>
                  Open to PhD 2026
                </div>

                <div className="mt-3">
                  <SDGSquaresUploadable goals={[
                    { id: 4, label: "Quality Education" },
                    { id: 7, label: "Clean Energy" },
                    { id: 9, label: "Industry & Innovation" },
                    { id: 11, label: "Sustainable Cities" },
                    { id: 13, label: "Climate Action" },
                    { id: 14, label: "Life Below Water" },
                  ]} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-extrabold leading-tight">
                  {person.name}
                </motion.h1>
                <p className="mt-2 text-neutral-300 max-w-prose">{person.tagline}</p>
                <p className="mt-2 text-xs text-neutral-400">Based in {person.location}</p>
              </div>

              <Card>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-80">TOEFL iBT</div>
                    <div className="text-3xl font-bold">91 / 120</div>
                    <div className="text-xs opacity-60 mt-1">R 23 • L 23 • S 23 • W 22</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">BSc EEE</div>
                    <div className="text-3xl font-bold">AUST</div>
                    <div className="text-xs opacity-60 mt-1">Thesis 4.00 • CGPA 3.00</div>
                  </div>

                  <div className="col-span-2 h-px bg-neutral-800 my-1" />

                  <div id="about" className="col-span-2">
                    <div className="text-sm font-semibold">About</div>
                    <p className="mt-1 text-sm text-neutral-300">{person.about}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Section id="featured" title="Featured" subtitle="Top work. Each card expands later with media and writeups.">
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((f, idx) => (
            <Card key={idx}>
              <div
                className="h-28 w-full rounded-xl mb-3"
                style={{
                  background: `linear-gradient(135deg, ${MIT.red}33, ${MIT.gray}22)`,
                  border: "1px solid #2b2b2b",
                }}
              />
              <div className="text-sm uppercase tracking-wide opacity-70">{f.tag}</div>
              <h3 className="text-lg font-semibold mt-1">{f.title}</h3>
              <ul className="mt-2 text-sm list-disc list-inside text-neutral-300">
                {f.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-neutral-400">Add: repo, demo, images</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="interests" title="Research Areas">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <div className="flex flex-wrap">
              {interests.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {[
                  ["Decentralized Control", 78],
                  ["Techno‑Economics", 82],
                  ["CFD/Physics Sim", 66],
                  ["Photonics/Optics", 58],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${MIT.red}, ${MIT.gray})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {[
                  ["Embedded Systems", 80],
                  ["Computer Vision", 60],
                  ["Power Electronics", 72],
                  ["Scientific Writing", 80],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${MIT.red}, ${MIT.gray})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="key" tick={{ fill: "#c9c9c9", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} tick={{ fill: "#aaa", fontSize: 9 }} />
                  <Radar name="You" dataKey="v" stroke={MIT.red} fill={MIT.red} fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Section>

      <Section id="experience" title="Experience" subtitle="Click cards to expand. Research first. Professional second.">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2"><Brain size={18} /> Research Experience</h4>
            <div className="space-y-5">
              {researchExp.map((e, i) => (
                <Expandable
                  key={i}
                  title={e.org}
                  subtitle={`${e.role} · ${e.period}`}
                  images={e.images}
                  preview={
                    <>
                      <IconRow icons={e.icons} />
                      <ul className="mt-2 list-disc list-inside text-sm text-neutral-300">
                        {e.bullets.map((w, wi) => (
                          <li key={wi}>{w}</li>
                        ))}
                      </ul>
                    </>
                  }
                  details={<p className="text-sm text-neutral-300">{e.long}</p>}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2"><Briefcase size={18} /> Professional Experience</h4>
            <div className="space-y-5">
              {professional.map((e, i) => (
                <Expandable
                  key={i}
                  title={e.org}
                  subtitle={`${e.role} · ${e.period}`}
                  images={e.images}
                  preview={
                    <>
                      <IconRow icons={e.icons} />
                      <ul className="mt-2 list-disc list-inside text-sm text-neutral-300">
                        {e.bullets.map((w, wi) => (
                          <li key={wi}>{w}</li>
                        ))}
                      </ul>
                    </>
                  }
                  details={<p className="text-sm text-neutral-300">{e.long}</p>}
                />
              ))}
              <Card>
                <div className="p-3 rounded-lg border text-xs" style={{ borderColor: "#2b2b2b" }}>
                  Add a short impact summary for industry roles. Mention metrics, owners, and systems moved.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section id="publications" title="Publications & IP" subtitle="Click items to see abstracts, links, and media.">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Journals — under review</h4>
            <div className="space-y-3">
              {publications.journals_under_review.map((p, i) => (
                <Expandable
                  key={`ju-${i}`}
                  title={p.title}
                  subtitle={`${p.venue} · ${p.status}`}
                  preview={null}
                  images={[]}
                  details={
                    <div className="text-sm text-neutral-300 space-y-2">
                      <p>{p.long}</p>
                      {p.links?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {p.links.map((l, idx) => (
                            <a key={idx} href={l.href} target="_blank" rel="noreferrer" className="text-xs underline opacity-80">
                              {l.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  }
                />
              ))}
            </div>

            <h4 className="font-semibold mt-5 mb-2">Manuscripts — in preparation</h4>
            <div className="space-y-3">
              {publications.manuscripts.map((p, i) => (
                <Expandable
                  key={`ms-${i}`}
                  title={p.title}
                  subtitle={`${p.venue} · ${p.status}`}
                  preview={null}
                  images={[]}
                  details={<p className="text-sm text-neutral-300">{p.long}</p>}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Conferences</h4>
            <div className="space-y-3">
              {publications.conferences.map((p, i) => (
                <Expandable
                  key={`cf-${i}`}
                  title={p.title}
                  subtitle={`${p.venue}${p.doi ? ` · DOI: ${p.doi}` : ""}`}
                  preview={null}
                  images={[]}
                  details={
                    <div className="text-sm text-neutral-300 space-y-2">
                      <p>{p.long}</p>
                      {p.links?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {p.links.map((l, idx) => (
                            <a key={idx} href={l.href} target="_blank" rel="noreferrer" className="text-xs underline opacity-80">
                              {l.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  }
                />
              ))}
            </div>

            <h4 className="font-semibold mt-5 mb-2">Book chapters</h4>
            <div className="space-y-3">
              {publications.chapters.map((p, i) => (
                <Expandable
                  key={`ch-${i}`}
                  title={p.title}
                  subtitle={`${p.venue} · ${p.status}`}
                  preview={null}
                  images={[]}
                  details={<p className="text-sm text-neutral-300">{p.long}</p>}
                />
              ))}
            </div>

            <h4 className="font-semibold mt-5 mb-2">IP and tech disclosures</h4>
            <div className="space-y-3">
              {publications.ip.map((p, i) => (
                <Expandable
                  key={`ip-${i}`}
                  title={p.title}
                  subtitle={`${p.type}${p.target ? ` · target ${p.target}` : ""}`}
                  preview={null}
                  images={[]}
                  details={<p className="text-sm text-neutral-300">{p.long}</p>}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: "#2b2b2b" }}>
          <div className="text-xs text-neutral-400">Extension space: add DOIs, preprints, open datasets, and code repositories.</div>
        </div>
      </Section>

      <Section id="grants" title="Grants" subtitle="Funding and scope">
        <div className="grid md:grid-cols-2 gap-6">
          {grants.map((g, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-sm opacity-80">{g.details}</div>
                </div>
                <div className="text-xs opacity-60 whitespace-nowrap">{g.year}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="teaching" title="Teaching & Mentorship" subtitle="Click to expand course lists and media.">
        <div className="grid md:grid-cols-2 gap-6">
          {teaching.map((t, i) => (
            <Expandable
              key={i}
              title={t.org}
              subtitle={`${t.role} · ${t.period}`}
              images={t.images}
              preview={
                <ul className="mt-2 list-disc list-inside text-sm text-neutral-300">
                  {t.work.map((w, wi) => (
                    <li key={wi}>{w}</li>
                  ))}
                </ul>
              }
              details={<p className="text-sm text-neutral-300">{t.long}</p>}
            />
          ))}
        </div>
      </Section>

      <Section id="awards" title="Awards" subtitle="Recognition">
        <Card>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-neutral-300">
            <li>Featured in Daily SAMAKAL for first “Made in Bangladesh” nanosatellite effort (Jan 2023)</li>
            <li>Emerging Talent of the Year — Alfatah Enterprise</li>
            <li>Top 5 — AUST Research Symposium 2022</li>
            <li>Finalist — Hult Prize On‑Campus 2023</li>
            <li>Winner — Lanka Bangla Notre Dame Science Festival 2013</li>
          </ul>
        </Card>
      </Section>

      <Section id="contact" title="Contact" subtitle="Email preferred. Responses are concise.">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm opacity-80">Email</div>
              <a href={`mailto:${person.email}`} className="text-lg font-semibold hover:underline">{person.email}</a>
            </div>
            <div className="flex gap-3">
              <a href={person.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: "#2b2b2b" }}>
                <Github size={16} /> GitHub
              </a>
              <a href={person.links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: "#2b2b2b" }}>
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={person.links.scholar} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: MIT.red, background: `${MIT.red}22` }}>
                <BookOpen size={16} /> Scholar
              </a>
            </div>
          </div>
        </Card>
        <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: "#2b2b2b" }}>
          <div className="text-xs text-neutral-400">Next edits</div>
          <ul className="list-disc list-inside text-sm text-neutral-300">
            <li>Add project images, videos, and paper links to Featured.</li>
            <li>Attach a PDF resume link and include a publications BibTeX modal.</li>
            <li>Add a section for open problems or research proposals.</li>
          </ul>
        </div>
      </Section>

      <footer className="py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {person.name}. MIT palette. Single‑page with anchored nav.
      </footer>

      <button
        onClick={() => scrollToId("hero")} aria-label="Back to top"
        className="fixed bottom-4 right-4 p-3 rounded-full border shadow-lg"
        style={{ borderColor: MIT.red, background: `${MIT.red}22` }}
      >
        <ChevronUp />
      </button>
    </div>
  );
}
