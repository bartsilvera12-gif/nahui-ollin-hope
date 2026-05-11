export function FloatingDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-turquoise/15 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-deep-blue/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-olive/10 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}
