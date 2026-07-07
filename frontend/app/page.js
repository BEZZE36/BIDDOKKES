import dynamic from "next/dynamic";
import Header from "../components/layout/Navbar";
import Hero from "../components/Hero";
import SignageStrip from "../components/SignageStrip";

const About = dynamic(() => import("../components/About"));
const Services = dynamic(() => import("../components/Services"));
const Procedures = dynamic(() => import("../components/Procedures"));
const Gallery = dynamic(() => import("../components/Gallery"));
const News = dynamic(() => import("../components/News"));
const FAQ = dynamic(() => import("../components/FAQ"));
const Location = dynamic(() => import("../components/Location"));
const Footer = dynamic(() => import("../components/layout/Footer"));

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SignageStrip />
        <About />
        <Services />
        <Procedures />
        <Gallery />
        <News />
        <FAQ />
        <Location />
      </main>
      <Footer />
    </>
  );
}
