// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        peach: "#FDE7C6",
        sand: "#FDDFAF",
        orange: "#E4986D",
        skyblue: "#6EC0D9",
      },
    },
  },
  plugins: [],
};

export default config;
