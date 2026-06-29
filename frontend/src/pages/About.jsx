import { ArrowUpRight, Home, PackageCheck, Wallet, CalendarDays, Smile } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { useEffect, useState } from "react";
import { buildGenericWa, LOGO_URL } from "../data/products";

export default function About() {
  const { t, lang } = useLang();
  
    const [serveIndex, setServeIndex] = useState(0);

  const serveSlides = [
  {
    title: "Cookies",
    desc:
      lang === "id"
        ? "Cookies chewy dengan varian fun: The Classic OG, The Velvet Crush, The Matcha Cookies, dan The Blue Monstiez."
        : "Chewy cookies with fun variants: The Classic OG, The Velvet Crush, The Matcha Cookies, and The Blue Monstiez.",
    image: "/assets/about/serve-cookies.png",
    bg: "#F6C77B",
    text: "#3A241C",
  },
  {
    title: "Bolu Mini",
    desc:
      lang === "id"
        ? "Bolu lembut ukuran personal dengan pilihan isian keju lumer atau topping keju parut."
        : "Soft personal-sized bolu with melted cheese filling or grated cheese topping.",
    image: "/assets/about/serve-bolu-mini.png",
    bg: "#A7C957",
    text: "#26351D",
  },
  {
    title: "Bolu BIG",
    desc:
      lang === "id"
        ? "Bolu ukuran besar dengan isian keju lumer, cocok untuk sharing bersama keluarga atau teman."
        : "A larger bolu with melted cheese filling, perfect for sharing with family or friends.",
    image: "/assets/about/serve-bolu-big.png",
    bg: "#8D5B4C",
    text: "#FFFFFF",
  },
  {
    title: "Brownies",
    desc:
      lang === "id"
        ? "Brownies ketan hitam yang rich, moist, dan cocok untuk pencinta manis-gurih."
        : "Rich and moist black sticky rice brownies, perfect for sweet and savory lovers.",
    image: "/assets/about/serve-brownies.png",
    bg: "#3B241F",
    text: "#FFFFFF",
  },
];

  useEffect(() => {
    const timer = setInterval(() => {
      setServeIndex((prev) => (prev + 1) % serveSlides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const currentServe = serveSlides[serveIndex];
  return (
    <div data-testid="page-about">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-[#8D5B4C]/10 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-[360px] w-[360px] rounded-full bg-[#FCD34D]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-12 md:pt-20 pb-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {t.about.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {t.about.title}
          </h1>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-5 text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
              <p>{t.about.body1}</p>
              <p>{t.about.body2}</p>

              <div className="pt-2">
                <a
                  href={buildGenericWa(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="about-order-cta"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FCD34D] px-6 py-3.5 text-[15px] font-semibold text-[#121212] hover:bg-[#121212] hover:text-white active:scale-[0.97] transition-all"
                >
                  {t.nav.orderNow}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
  <div className="rounded-[2.5rem] min-h-[420px] flex items-start justify-center pt-4 -mt-16">
    <div className="grid grid-cols-2 gap-4 sm:gap-6 place-items-center">
      <img
        src="/assets/mascots/mascot-1.png"
        alt="Moobits mascot 1"
        className="w-28 sm:w-36 md:w-40 object-contain mascot-float-1"
      />
      <img
        src="/assets/mascots/mascot-2.png"
        alt="Moobits mascot 2"
        className="w-28 sm:w-36 md:w-40 object-contain mascot-float-2"
      />
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Brand Story + Meaning */}
<section className="px-6 sm:px-10 lg:px-20 py-16 bg-[#FDFBF7]">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
    <div className="rounded-3xl bg-white border border-black/5 p-8 shadow-sm">
    <img
  src="/assets/about/brand-story.png"
  alt="Moobits product line up"
  className="w-full h-52 object-contain rounded-2xl mb-6 bg-[#FDFBF7]"
/>
      <p className="text-xs uppercase tracking-[0.25em] text-[#8D5B4C] font-bold mb-4">
  {lang === "id" ? "Cerita Moobits" : "Brand Story"}
</p>

<h2 className="text-3xl font-bold text-[#121212] mb-6 leading-tight">
  {lang === "id"
    ? "Camilan Manis untuk Mood yang Lebih Baik"
    : "Sweet Treats for a Better Mood"}
</h2>

<p className="text-[#4B4B4B] leading-8 mb-5">
  {lang === "id"
    ? "Moobits lahir dari ide sederhana: camilan manis bisa jadi cara kecil untuk bikin hari terasa lebih baik. Berawal dari kecintaan terhadap sweet treats dan kebiasaan menikmati makanan manis sebagai mood booster, Moobits berkembang menjadi brand homemade yang menghadirkan rasa comforting dan tampilan yang menarik."
    : "Moobits was born from a simple idea: sweet treats can be a small way to make the day feel better. Starting from a love for sweet treats and the habit of enjoying desserts as a mood booster, Moobits grew into a homemade brand that brings comforting flavors with a playful look."}
</p>

<p className="text-[#4B4B4B] leading-8">
  {lang === "id"
    ? "Setiap produk dibuat dengan sentuhan personal, mulai dari cookies chewy, bolu lembut, sampai brownies ketan hitam yang rich."
    : "Every product is made with a personal touch, from chewy cookies and soft bolu to rich black sticky rice brownies."}
</p>
    </div>

    <div className="rounded-3xl bg-white border border-black/5 p-8 shadow-sm">
    <img
  src="/assets/about/meaning-moobits.png"
  alt="Moobits logo"
  className="w-full h-52 object-contain rounded-2xl mb-6 bg-[#FDFBF7] p-6"
/>
      <p className="text-xs uppercase tracking-[0.25em] text-[#8D5B4C] font-bold mb-4">
  {lang === "id" ? "Makna Moobits" : "Meaning of Moobits"}
</p>

<h2 className="text-3xl font-bold text-[#121212] mb-6 leading-tight">
  Mood in a Bites
</h2>

<p className="text-[#4B4B4B] leading-8 mb-5">
  {lang === "id"
    ? "Nama Moobits terinspirasi dari “Mood in a Bites”, yang menggambarkan harapan Moobits untuk menghadirkan mood yang lebih baik lewat setiap gigitan."
    : "The name Moobits is inspired by “Mood in a Bites”, which reflects Moobits’ hope to bring a better mood through every bite."}
</p>

<p className="text-[#4B4B4B] leading-8">
  {lang === "id"
    ? "Moobits ingin menjadi sweet treats yang dekat dengan keseharian customer: bisa jadi self treat, teman kerja atau belajar, camilan keluarga, sampai pilihan kecil untuk berbagi kebahagiaan."
    : "Moobits is made to be part of everyday moments: as a self treat, a study or work companion, a family snack, or a little way to share happiness."}
</p>
    </div>
  </div>
</section>

      {/* What We Serve */}
      <section className="px-6 sm:px-10 lg:px-20 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8D5B4C] font-bold mb-4">
  {lang === "id" ? "Yang Kami Sajikan" : "What We Serve"}
</p>

<h2 className="text-3xl sm:text-4xl font-bold text-[#121212] mb-4">
  {lang === "id"
    ? "Sweet Treats untuk Setiap Mood"
    : "Sweet Treats for Every Mood"}
</h2>

<p className="text-[#4B4B4B] leading-8">
  {lang === "id"
    ? "Pilih mood kamu hari ini, Moobits punya sweet treats yang siap nemenin."
    : "Pick your mood today, Moobits has sweet treats ready to accompany you."}
</p>
          </div>

          <div
 className="rounded-[2rem] overflow-hidden p-8 sm:p-10 min-h-[420px] transition-colors duration-700 ease-in-out"           
            style={{
              backgroundColor: currentServe.bg,
              color: currentServe.text,
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] font-bold opacity-80 mb-4">
                  Our Treats
                </p>

                <h3 className="text-4xl sm:text-5xl font-bold mb-5">
                  {currentServe.title}
                </h3>

                <p className="text-lg leading-8 opacity-90 max-w-xl">
                  {currentServe.desc}
                </p>

                <div className="flex gap-2 mt-8">
                  {serveSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setServeIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        serveIndex === index
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center items-center h-72 sm:h-80">
  <img
    src={currentServe.image}
    alt={currentServe.title}
    className="max-h-full max-w-full object-contain drop-shadow-xl serve-image-wiggle"
  />
</div>
            </div>
          </div>
        </div>
      </section>

                        {/* Values */}
      <section className="px-6 sm:px-10 lg:px-20 py-16 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8D5B4C] font-bold mb-4">
              {lang === "id" ? "Nilai Moobits" : "Our Values"}
            </p>

            <h2 className="text-4xl sm:text-5xl font-bold text-[#121212] leading-tight">
              {lang === "id"
                ? "Apa yang membuat Moobits, Moobits."
                : "What makes Moobits, Moobits."}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-[1.75rem] bg-white border border-black/5 p-7 shadow-sm">
              <div className="h-1.5 w-10 rounded-full bg-[#8D5B4C] mb-6" />

              <div className="w-12 h-12 rounded-2xl bg-[#8D5B4C]/10 flex items-center justify-center mb-5">
                <Home className="w-6 h-6 text-[#8D5B4C]" />
              </div>

              <h3 className="text-xl font-bold text-[#121212] mb-3">
                Homemade
              </h3>

              <p className="text-[#4B4B4B] leading-7">
                {lang === "id"
                  ? "Diolah langsung dari dapur kami dengan sentuhan personal."
                  : "Made from our kitchen with a warm personal touch."}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white border border-black/5 p-7 shadow-sm">
              <div className="h-1.5 w-10 rounded-full bg-[#86A789] mb-6" />

              <div className="w-12 h-12 rounded-2xl bg-[#86A789]/15 flex items-center justify-center mb-5">
                <PackageCheck className="w-6 h-6 text-[#5F8D68]" />
              </div>

              <h3 className="text-xl font-bold text-[#121212] mb-3">
                {lang === "id" ? "Freshly Made by Order" : "Freshly Made by Order"}
              </h3>

              <p className="text-[#4B4B4B] leading-7">
                {lang === "id"
                  ? "Setiap pesanan dibuat baru, bukan stok lama."
                  : "Every order is freshly made, not taken from old stock."}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white border border-black/5 p-7 shadow-sm">
              <div className="h-1.5 w-10 rounded-full bg-[#FCD34D] mb-6" />

              <div className="w-12 h-12 rounded-2xl bg-[#FCD34D]/20 flex items-center justify-center mb-5">
                <Wallet className="w-6 h-6 text-[#C28A00]" />
              </div>

              <h3 className="text-xl font-bold text-[#121212] mb-3">
                Affordable
              </h3>

              <p className="text-[#4B4B4B] leading-7">
                {lang === "id"
                  ? "Harga ramah untuk camilan yang tetap premium."
                  : "Friendly prices for sweet treats that still feel premium."}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white border border-black/5 p-7 shadow-sm">
              <div className="h-1.5 w-10 rounded-full bg-[#9B2C2C] mb-6" />

              <div className="w-12 h-12 rounded-2xl bg-[#9B2C2C]/10 flex items-center justify-center mb-5">
                <CalendarDays className="w-6 h-6 text-[#9B2C2C]" />
              </div>

              <h3 className="text-xl font-bold text-[#121212] mb-3">
                Daily Treats
              </h3>

              <p className="text-[#4B4B4B] leading-7">
                {lang === "id"
                  ? "Pas dinikmati sehari-hari, bukan cuma momen spesial."
                  : "Made for everyday cravings, not only special moments."}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white border border-black/5 p-7 shadow-sm">
              <div className="h-1.5 w-10 rounded-full bg-[#3B82F6] mb-6" />

              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mb-5">
                <Smile className="w-6 h-6 text-[#3B82F6]" />
              </div>

              <h3 className="text-xl font-bold text-[#121212] mb-3">
                Mood Booster
              </h3>

              <p className="text-[#4B4B4B] leading-7">
                {lang === "id"
                  ? "Manis kecil yang bikin hari kamu lebih baik."
                  : "A little sweetness to make your day feel better."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Mascot */}
<section className="px-6 sm:px-10 lg:px-20 py-16 bg-white">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#8D5B4C] font-bold mb-4">
  {lang === "id" ? "Kenalan dengan Maskot Kami" : "Meet Our Mascot"}
</p>

<h2 className="text-3xl sm:text-4xl font-bold text-[#121212] mb-5">
  {lang === "id"
    ? "Teman Kecil yang Bikin Moobits Lebih Hidup"
    : "A Little Friend That Brings Moobits to Life"}
</h2>

<p className="text-[#4B4B4B] leading-8 mb-5">
  {lang === "id"
    ? "Maskot Moobits hadir sebagai representasi kecil dari karakter brand ini: manis, hangat, playful, dan bisa bikin mood terasa lebih baik."
    : "The Moobits mascot represents the heart of the brand: sweet, warm, playful, and made to bring a better mood."}
</p>

<p className="text-[#4B4B4B] leading-8">
  {lang === "id"
    ? "Dengan ekspresi yang lucu dan simple, maskot ini menjadi teman visual Moobits yang membuat brand terasa lebih dekat, hidup, dan mudah diingat."
    : "With its cute and simple expression, the mascot becomes Moobits’ visual companion, making the brand feel closer, livelier, and easier to remember."}
</p>
    </div>

    <div className="grid grid-cols-2 gap-4 place-items-center">
      <img src="/assets/mascots/mascot-1.png" alt="Moobits mascot 1" className="w-28 sm:w-36 object-contain mascot-float-1" />
      <img src="/assets/mascots/mascot-2.png" alt="Moobits mascot 2" className="w-28 sm:w-36 object-contain mascot-float-2" />
      <img src="/assets/mascots/mascot-3.png" alt="Moobits mascot 3" className="w-28 sm:w-36 object-contain mascot-float-3" />
      <img src="/assets/mascots/mascot-4.png" alt="Moobits mascot 4" className="w-28 sm:w-36 object-contain mascot-float-4" />
    </div>
  </div>
</section>

{/* Closing CTA */}
<section className="px-6 sm:px-10 lg:px-20 py-16 bg-[#FDFBF7]">
  <div className="max-w-5xl mx-auto rounded-[2rem] bg-[#121212] p-10 sm:p-14 text-center">
    <p className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
      {lang === "id"
        ? "Setiap gigitan dibuat untuk memperbaiki mood kamu."
        : "Every bite is made to fix your mood."}
    </p>

    <p className="text-white/80 leading-8 max-w-2xl mx-auto mb-8 text-center">
      {lang === "id"
        ? "Moobits hadir dengan homemade sweet treats yang siap nemenin hari kamu. Pilih menu favoritmu dan order langsung via WhatsApp."
        : "Moobits brings homemade sweet treats to brighten your day. Pick your favorite menu and order directly through WhatsApp."}
    </p>

    <a
      href={buildGenericWa()}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-[#FCD34D] hover:bg-[#FBBF24] text-black font-semibold px-8 py-4 transition"
    >
      {lang === "id" ? "Lihat Menu Moobits" : "See Moobits Menu"}
    </a>
  </div>
</section>
  
    </div>
  );
}
