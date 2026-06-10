import React, { useEffect, useRef, useState } from 'react'
import {
  Activity,
  Cpu,
  Database,
  Globe,
  MemoryStick,
  Timer,
  Layers,
  FileText,
  FilePlus,
  Image,
  Cloud
} from 'lucide-react'


type Stat = {
  bundle: number
  weight: number
  dom: number
  resources: number
  js: number
  css: number
  img: number
  cache: number
  memory: number
  load: number
  rps: number
  pl: number
}

const limits = {
  weight: [512_000, 1_048_576],
  dom: [1_000, 2_000],
  resources: [50, 100],
  js: [153_600, 307_200],
  css: [51_200, 102_400],
  img: [307_200, 716_800],
  cache: [0.6, 0.4]
}

const color = (v: number, [g, y]: number[], inv = false) =>
  inv
    ? v >= g
      ? 'border-green-500/30 bg-green-500/20'
      : v >= y
      ? 'border-yellow-500/30 bg-yellow-500/20'
      : 'border-red-500/30 bg-red-500/20'
    : v <= g
    ? 'border-green-500/30 bg-green-500/20'
    : v <= y
    ? 'border-yellow-500/30 bg-yellow-500/20'
    : 'border-red-500/30 bg-red-500/20'

export default function App() {
  const [stats, setStats] = useState<Stat>({
    bundle: 0,
    weight: 0,
    dom: 0,
    resources: 0,
    js: 0,
    css: 0,
    img: 0,
    cache: 0,
    memory: 0,
    load: 0,
    rps: 0,
    pl: 0
  })
  const [ready, setReady] = useState(false)

  const intervalRef = useRef<number>()

  useEffect(() => {
    const startTime = performance.now();

    const computeStats = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      if (!nav) return;

      const totalWeight = nav.transferSize + resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const jsWeight = resources.filter(r => r.initiatorType === 'script').reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const cssWeight = resources.filter(r => r.initiatorType === 'link').reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const imgWeight = resources
        .filter(
          r =>
            r.initiatorType === 'img' ||
            r.initiatorType === 'css' ||
            /\.(jpg|jpeg|png|gif|webp)$/i.test(r.name)
        )
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalEncoded = nav.encodedBodySize + resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
      const cacheRatio = totalEncoded ? 1 - totalWeight / totalEncoded : 0;

      setStats(s => ({
        ...s,
        bundle: nav.transferSize,
        weight: totalWeight,
        dom: document.getElementsByTagName('*').length,
        resources: resources.length,
        js: jsWeight,
        css: cssWeight || s.css,
        img: imgWeight || s.img,
        cache: cacheRatio,
        pl: Math.round(performance.now() - startTime)
      }));
      setReady(true);
    };

    if (document.readyState === 'complete') {
      computeStats();
    } else {
      window.addEventListener('load', computeStats, { once: true });
    }
  }, []);

  useEffect(() => {
    if (intervalRef.current) return
    intervalRef.current = window.setInterval(async () => {
      if (document.hidden) return
      try {
        const { memory, load, rps } = await fetch('http://localhost:5001/api/server', {
          cache: 'no-store'
        }).then(r => r.json())

        setStats(s => {
          const nextMemory = Math.ceil(memory / 1_048_576)

          if (
            s.memory === nextMemory &&
            s.load === load &&
            s.rps === rps
          ) {
            return s
          }

          return {
            ...s,
            memory: nextMemory,
            load,
            rps
          }
        })
      } catch (err) {
        console.warn('Erreur lors du fetch des stats serveur', err)
      }
    }, 30000)

    return () => clearInterval(intervalRef.current)
  }, [])

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin h-24 w-24 rounded-full border-b-2 border-white mx-auto mb-6" />
          <p className="text-white text-xl font-semibold">Chargement…</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-purple-900 text-white">
      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-pink-400 bg-clip-text text-transparent mb-6">
            EcoTraining Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">Plateforme d'entraînement avancée pour l'optimisation web et l'éco-conception</p>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          <Card icon={<Database className="w-8 h-8 text-purple-400" />} title="Poids HTML" value={`${(stats.bundle / 1_024).toFixed(0)} kB`} tone={color(stats.bundle, limits.weight)} tip="transferSize du document" />
          <Card icon={<Globe className="w-8 h-8 text-blue-400" />} title="Poids page" value={`${(stats.weight / 1_024).toFixed(0)} kB`} tone={color(stats.weight, limits.weight)} tip="somme transferSize" />
          <Card icon={<Layers className="w-8 h-8 text-teal-400" />} title="DOM" value={stats.dom} tone={color(stats.dom, limits.dom)} tip="nombre de nœuds" />
          <Card icon={<Activity className="w-8 h-8 text-green-400" />} title="Ressources" value={stats.resources} tone={color(stats.resources, limits.resources)} tip="entries PerformanceResourceTiming" />
          <Card icon={<FileText className="w-8 h-8 text-fuchsia-400" />} title="JS" value={`${(stats.js / 1_024).toFixed(0)} kB`} tone={color(stats.js, limits.js)} />
          <Card icon={<FilePlus className="w-8 h-8 text-sky-400" />} title="CSS" value={`${(stats.css / 1024).toFixed(1)} kB`} tone={color(stats.css, limits.css)} />
          <Card icon={<Image className="w-8 h-8 text-amber-400" />} title="Images" value={`${(stats.img / 1_024).toFixed(0)} kB`} tone={color(stats.img, limits.img)} />
          <Card icon={<Cloud className="w-8 h-8 text-emerald-400" />} title="Cache hit" value={`${Math.round(stats.cache * 100)} %`} tone={color(stats.cache, limits.cache, true)} />
          <Card icon={<MemoryStick className="w-8 h-8 text-red-400" />} title="RAM serveur" value={`${stats.memory} MB`} tone="bg-white/10 border-white/20" />
          <Card icon={<Cpu className="w-8 h-8 text-indigo-400" />} title="CPU" value={stats.load} tone="bg-white/10 border-white/20" />
          <Card icon={<Activity className="w-8 h-8 text-lime-400" />} title="RPS" value={stats.rps} tone="bg-white/10 border-white/20" />
          <Card icon={<Timer className="w-8 h-8 text-yellow-400" />} title="Load page" value={`${stats.pl} ms`} tone="bg-white/10 border-white/20" />
        </section>
      </div>
    </div>
  )
}

function Card({ icon, title, value, tone, tip }: { icon: React.ReactNode; title: string; value: string | number; tone: string; tip?: string }) {
  return (
    <div className={`rounded-2xl p-8 border ${tone}`} title={tip || ''}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  )
}