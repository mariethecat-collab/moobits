// Minimalist CSS/SVG illustrations for products without photos.
// Designed to feel premium and on-brand. Used inside the same dark "Jewel Box" frame.

const Sprinkles = ({ colors = ["#FCD34D", "#9B2C2C", "#3B82F6", "#86A789"] }) => (
  <g>
    {Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const r = 110 + ((i * 13) % 30);
      const cx = 150 + Math.cos(angle) * r;
      const cy = 150 + Math.sin(angle) * r * 0.6;
      const color = colors[i % colors.length];
      return (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} opacity="0.85" />
      );
    })}
  </g>
);

const Cheese = ({ baseColor }) => (
  <g>
    {Array.from({ length: 22 }).map((_, i) => {
      const x = 70 + ((i * 47) % 160);
      const y = 90 + ((i * 31) % 110);
      const w = 10 + ((i * 7) % 10);
      return (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height="3"
          rx="1.5"
          fill="#FCD34D"
          opacity="0.95"
          transform={`rotate(${(i * 23) % 90} ${x} ${y})`}
        />
      );
    })}
  </g>
);

const ChocoChips = () => (
  <g>
    {Array.from({ length: 11 }).map((_, i) => {
      const x = 80 + ((i * 53) % 140);
      const y = 90 + ((i * 41) % 110);
      return (
        <polygon
          key={i}
          points={`${x},${y} ${x + 10},${y} ${x + 5},${y + 9}`}
          fill="#3F2418"
        />
      );
    })}
  </g>
);

const variants = {
  "bolu-ketanhitam": {
    base: "#2A1F22",
    rim: "#3A2A2E",
    topping: <Cheese />,
    shape: "dome",
  },
  "bolu-pandan": {
    base: "#86A789",
    rim: "#6E8C71",
    topping: <Cheese />,
    shape: "dome",
  },
  "bolu-redvelvet": {
    base: "#9B2C2C",
    rim: "#7E2222",
    topping: <Cheese />,
    shape: "dome",
  },
  "bolubig-ketanhitam": {
    base: "#2A1F22",
    rim: "#3A2A2E",
    topping: <Cheese />,
    shape: "tall",
  },
  "bolubig-pandan": {
    base: "#86A789",
    rim: "#6E8C71",
    topping: <Cheese />,
    shape: "tall",
  },
  "brownies-keju": {
    base: "#3F2418",
    rim: "#2A1810",
    topping: <Cheese />,
    shape: "slab",
  },
  "brownies-half": {
    base: "#3F2418",
    rim: "#2A1810",
    topping: (
      <g>
        <g clipPath="url(#leftHalf)">
          <Cheese />
        </g>
        <g clipPath="url(#rightHalf)">
          <ChocoChips />
        </g>
      </g>
    ),
    shape: "slab",
  },
};

export const CategoryIllustration = ({ type, className = "" }) => {
  const v = variants[type] || variants["bolu-ketanhitam"];
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <radialGradient id={`bg-${type}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id={`shade-${type}`} cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="150" height="300" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="150" y="0" width="150" height="300" />
        </clipPath>
      </defs>

      <rect width="300" height="300" fill={`url(#bg-${type})`} />

      {v.shape === "dome" && (
        <>
          <ellipse cx="150" cy="200" rx="100" ry="22" fill="rgba(0,0,0,0.55)" />
          <path
            d={`M50 180 Q150 60 250 180 Z`}
            fill={v.base}
          />
          <path
            d={`M50 180 Q150 60 250 180 Z`}
            fill={`url(#shade-${type})`}
          />
          <ellipse
            cx="150"
            cy="180"
            rx="100"
            ry="14"
            fill={v.rim}
          />
          {v.topping}
        </>
      )}

      {v.shape === "tall" && (
        <>
          <ellipse cx="150" cy="240" rx="110" ry="22" fill="rgba(0,0,0,0.55)" />
          <rect x="50" y="120" width="200" height="110" rx="18" fill={v.rim} />
          <ellipse cx="150" cy="120" rx="100" ry="34" fill={v.base} />
          <ellipse
            cx="150"
            cy="120"
            rx="100"
            ry="34"
            fill={`url(#shade-${type})`}
          />
          <g transform="translate(0,-30)">{v.topping}</g>
        </>
      )}

      {v.shape === "slab" && (
        <>
          <ellipse cx="150" cy="230" rx="120" ry="20" fill="rgba(0,0,0,0.55)" />
          <rect x="40" y="100" width="220" height="120" rx="22" fill={v.rim} />
          <rect x="48" y="92" width="204" height="22" rx="11" fill={v.base} />
          <rect
            x="40"
            y="100"
            width="220"
            height="120"
            rx="22"
            fill={`url(#shade-${type})`}
          />
          <g transform="translate(0,8)">{v.topping}</g>
        </>
      )}

      <Sprinkles />
    </svg>
  );
};

export default CategoryIllustration;
