export default function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft background with subtle color */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50"></div>
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl"></div>
      
      {/* Fine grid pattern */}
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: `
          linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}></div>
    </div>
  );
}
