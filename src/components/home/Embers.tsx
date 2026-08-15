const embers = [
  { left: "12%", delay: "0s", size: 3 },
  { left: "26%", delay: "2.5s", size: 2 },
  { left: "41%", delay: "5s", size: 4 },
  { left: "58%", delay: "1.2s", size: 2 },
  { left: "73%", delay: "3.8s", size: 3 },
  { left: "88%", delay: "6.4s", size: 2 },
];

export function Embers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="animate-ember absolute bottom-1/4 rounded-full bg-gold/60 blur-[1px]"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: e.delay,
          }}
        />
      ))}
    </div>
  );
}
