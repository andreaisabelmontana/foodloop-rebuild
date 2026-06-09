import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main>
      {/* ---- Header ---- */}
      <header className="topbar">
        <div className="brand">
          <span className="logo">🥬</span> FoodLoop
        </div>
        <nav>
          <a href="#how">როგორ მუშაობს</a>
          <a href="#join">სიაში შეერთება</a>
          <Link href="/admin/">Admin</Link>
        </nav>
      </header>

      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">საქართველოს მდგრადი კვების ქსელი</p>
          <h1>
            ხელმისაწვდომი საკვები,
            <br /> შენს უბანში.
          </h1>
          <p className="lead">
            FoodLoop connects neighbors with cafes, bakeries, restaurants and markets
            that have <strong>affordable surplus meals</strong> and daily offers —
            cutting waste, feeding the neighborhood.
          </p>
          <div className="hero-cta">
            <a href="#join" className="btn-primary">სიაში შეერთება / Join the waitlist</a>
            <a href="#how" className="btn-ghost">როგორ მუშაობს →</a>
          </div>
        </div>
        <div className="market-sheet" aria-hidden="true">
          {/* A "market sheet": a price-list card in the produce-stall tradition. */}
          <div className="sheet-head">
            <span>დღის შეთავაზება</span>
            <span>TODAY&apos;S OFFERS</span>
          </div>
          <ul>
            <li><span>🥐 ცხელი ხაჭაპური</span><span className="old">₾6.00</span><span className="new">₾2.50</span></li>
            <li><span>🍞 გუშინდელი პური</span><span className="old">₾3.00</span><span className="new">₾1.00</span></li>
            <li><span>🥗 სეზონური სალათი</span><span className="old">₾8.00</span><span className="new">₾3.50</span></li>
            <li><span>🍰 ნამცხვარი</span><span className="old">₾5.00</span><span className="new">₾2.00</span></li>
            <li><span>🥘 დღის კერძი</span><span className="old">₾12.0</span><span className="new">₾5.00</span></li>
          </ul>
          <div className="sheet-foot">↻ surplus, not waste</div>
        </div>
      </section>

      {/* ---- Stats band ---- */}
      <section className="stats">
        <div><strong>~30%</strong><span>of food in Georgia is wasted</span></div>
        <div><strong>2×</strong><span>sides of the loop: eaters &amp; sellers</span></div>
        <div><strong>0₾</strong><span>cost to join the waitlist</span></div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how" className="how">
        <h2>როგორ მუშაობს / How the loop works</h2>
        <div className="steps">
          <div className="step">
            <span className="num">1</span>
            <h3>აღმოაჩინე</h3>
            <p>Discover nearby businesses posting surplus meals and end-of-day offers.</p>
          </div>
          <div className="step">
            <span className="num">2</span>
            <h3>დაჯავშნე</h3>
            <p>Reserve a portion at a reduced price before it would otherwise be thrown out.</p>
          </div>
          <div className="step">
            <span className="num">3</span>
            <h3>აიღე</h3>
            <p>Pick it up from the shop. The food gets eaten, the business earns, waste drops.</p>
          </div>
        </div>
      </section>

      {/* ---- Waitlist ---- */}
      <section id="join" className="join">
        <div className="join-copy">
          <h2>იყავი პირველი</h2>
          <p>
            We&apos;re starting in Tbilisi neighborhoods. Tell us whether you want to
            <strong> find meals</strong> or <strong>list your surplus</strong>, and
            we&apos;ll notify you at launch.
          </p>
        </div>
        <WaitlistForm />
      </section>

      <footer className="footer">
        <span>🥬 FoodLoop</span>
        <span>Making the Georgian food industry sustainable · A clean-room rebuild</span>
      </footer>
    </main>
  );
}
