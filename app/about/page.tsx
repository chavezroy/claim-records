import Image from 'next/image';
import Link from 'next/link';
import { artists } from '@/lib/data/artists';
import { getFeaturedProducts } from '@/lib/data/products';
import ArtistCard from '@/components/artists/ArtistCard';
import ProductCard from '@/components/shop/ProductCard';
import GetInTouch from '@/components/contact/GetInTouch';

export default function AboutPage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-dark text-white" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '100%' }}>
            <h1 className="h1 mb-4 font-electric">Claim Records</h1>
            <p className="fs-5 text-gray-300 mb-4">Claim Your Stake!</p>
            <p className="fs-5 text-gray-300 mb-0">
              An independent record label dedicated to amplifying authentic voices and groundbreaking music.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="h1 mb-5 font-electric">Our Mission</h2>
              <p className="fs-5 text-gray-700 mb-4">
                Claim Records is built on the foundation of artistic integrity and creative freedom. 
                We believe in giving artists the platform they deserve to share their authentic stories 
                and connect with audiences who truly understand their vision.
              </p>
              <p className="fs-5 text-gray-700 mb-0">
                Our mission is to discover, develop, and promote exceptional talent while maintaining 
                the highest standards of artistic expression and industry innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="h1 mb-5 font-electric text-center">Our Story</h2>
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h3 className="h4 mb-3 text-primary">The Beginning</h3>
                  <p className="text-gray-700">
                    Claim Records was founded with a simple yet powerful vision: to create a space 
                    where artists can thrive without compromising their creative integrity. We started 
                    as a small independent label with a passion for discovering raw, unfiltered talent.
                  </p>
                </div>
                <div className="col-md-6">
                  <h3 className="h4 mb-3 text-primary">Today</h3>
                  <p className="text-gray-700">
                    Today, we're proud to represent a diverse roster of artists who push boundaries 
                    and challenge conventions. From rock and metal to experimental sounds, our artists 
                    represent the cutting edge of independent music.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="h1 mb-5 font-electric">What We Stand For</h2>
          </div>
          <div className="row">
            <div className="col-md-4 mb-5 mb-md-0 text-center">
              <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <i className="bi bi-music-note-beamed text-primary" style={{ fontSize: '3rem', lineHeight: '1', display: 'block' }}></i>
              </div>
              <h3 className="h5 mb-3" style={{ fontWeight: '600', color: '#23201f' }}>Artistic Freedom</h3>
              <p className="text-gray-700" style={{ lineHeight: '1.6', margin: '0' }}>
                We believe artists should have complete creative control over their work and vision.
              </p>
            </div>
            <div className="col-md-4 mb-5 mb-md-0 text-center">
              <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <i className="bi bi-people text-primary" style={{ fontSize: '3rem', lineHeight: '1', display: 'block' }}></i>
              </div>
              <h3 className="h5 mb-3" style={{ fontWeight: '600', color: '#23201f' }}>Artist Development</h3>
              <p className="text-gray-700" style={{ lineHeight: '1.6', margin: '0' }}>
                We invest in long-term relationships, helping artists grow and evolve their careers.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <i className="bi bi-heart text-primary" style={{ fontSize: '3rem', lineHeight: '1', display: 'block' }}></i>
              </div>
              <h3 className="h5 mb-3" style={{ fontWeight: '600', color: '#23201f' }}>Authenticity</h3>
              <p className="text-gray-700" style={{ lineHeight: '1.6', margin: '0' }}>
                We champion genuine expression and support artists who stay true to themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="bg-gray-50" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <h2 className="h1 mb-5 font-electric text-center">Our Artists</h2>
          <p className="text-center text-gray-700 mb-5 fs-5">
            Discover the talented artists who make Claim Records what it is today.
          </p>
          <div className="row mb-5">
            {artists.slice(0, 4).map((artist) => (
              <div key={artist.id} className="col-sm-3 mb-3 mb-sm-0">
                <ArtistCard artist={artist} variant="card" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/artists" className="btn btn-primary bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 no-underline">
              View All Artists
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - One Row */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <h2 className="h1 mb-5 font-electric text-center">Shop Claim Records</h2>
          <p className="text-center text-gray-700 mb-5 fs-5">
            Support your favorite artists with official Claim Records merchandise.
          </p>
          <div className="row mb-5">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-sm-3 mb-3 mb-sm-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop" className="btn btn-primary bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 no-underline">
              Visit Shop
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <GetInTouch variant="default" />
    </>
  );
}
