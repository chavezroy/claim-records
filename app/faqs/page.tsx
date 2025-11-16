'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/data/products';
import ProductCard from '@/components/shop/ProductCard';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'How do I submit my music to Claim Records?',
    answer: 'We\'re always looking for new talent! Please send your demo, EPK (Electronic Press Kit), and any relevant links to info@claimrecordslabel.com. Include a brief bio, social media links, and samples of your work. Our A&R team reviews all submissions, though response times may vary based on volume.',
  },
  {
    question: 'What genres does Claim Records work with?',
    answer: 'Claim Records represents a diverse roster of artists across rock, metal, experimental, and alternative genres. We focus on authentic, boundary-pushing music regardless of specific genre labels. If your sound is genuine and innovative, we want to hear it.',
  },
  {
    question: 'Do you offer record deals or distribution services?',
    answer: 'Yes, we offer various types of agreements depending on the artist and project. This can include full record deals, distribution-only agreements, or partnership arrangements. Each situation is unique, and we work with artists to find the best fit for their career goals.',
  },
  {
    question: 'How can I license Claim Records music for my project?',
    answer: 'For licensing inquiries, please contact us at info@claimrecordslabel.com with details about your project, intended use, and timeline. We handle sync licensing for film, TV, commercials, and other media. Response times are typically 5-7 business days.',
  },
  {
    question: 'What is your return and refund policy for merchandise?',
    answer: 'We want you to be happy with your purchase! Items can be returned within 30 days of delivery in their original condition. Please email info@claimrecordslabel.com with your order number to initiate a return. Refunds will be processed once we receive the returned item. Shipping costs are non-refundable unless the item was defective or incorrect.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Domestic orders typically ship within 3-5 business days and arrive within 5-7 business days. International orders may take 10-21 business days depending on the destination. You\'ll receive a tracking number once your order ships.',
  },
  {
    question: 'Do you offer wholesale or bulk orders?',
    answer: 'Yes! We offer wholesale pricing for retailers, venues, and organizations ordering in bulk. Please contact us at info@claimrecordslabel.com with your order details and we\'ll provide a custom quote.',
  },
  {
    question: 'How can I stay updated on new releases and news?',
    answer: 'The best way to stay connected is to subscribe to our newsletter in the footer, follow us on social media (@claimrecords), and check our website regularly. Newsletter subscribers get early access to releases, exclusive content, and special offers.',
  },
  {
    question: 'Can I book Claim Records artists for shows or events?',
    answer: 'Booking inquiries should be directed to info@claimrecordslabel.com with event details, dates, and venue information. We\'ll forward your request to the appropriate artist management team. Please note that booking availability varies by artist.',
  },
  {
    question: 'Do you work with independent artists on a distribution-only basis?',
    answer: 'Yes, we offer distribution services for independent artists who want to maintain creative control while accessing our distribution network. Contact us to discuss your specific needs and see if we\'re a good fit for your project.',
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-dark text-white" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '100%' }}>
            <h1 className="h1 mb-4 font-electric">Frequently Asked Questions</h1>
            <p className="fs-5 text-gray-300">
              Find answers to common questions about Claim Records, our artists, and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="faq-list" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="faq-item mb-4 border-b border-gray-200 pb-4"
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="faq-question w-full text-left d-flex justify-content-between align-items-center p-0 bg-transparent border-0"
                      style={{
                        cursor: 'pointer',
                        padding: '0.5rem 0.75rem 0.5rem 0',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#23201f',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                    <span style={{ flex: '1', paddingRight: '1rem' }}>{faq.question}</span>
                    <i
                      className={`bi ${openIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'} text-primary`}
                      style={{ 
                        fontSize: '1.25rem', 
                        transition: 'transform 0.3s',
                        flexShrink: '0',
                        marginLeft: 'auto'
                      }}
                    ></i>
                  </button>
                  {openIndex === index && (
                    <div
                      className="faq-answer mt-3 text-gray-700"
                      style={{
                        lineHeight: '1.6',
                        paddingTop: '0.5rem',
                        animation: 'fadeIn 0.3s ease-in',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="bg-gray-50" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 className="h2 mb-4 font-electric">Still Have Questions?</h2>
            <p className="text-gray-700 mb-4">
              Can't find what you're looking for? We're here to help. Reach out to us directly and we'll get back to you as soon as possible.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a
                href="mailto:info@claimrecordslabel.com"
                className="btn btn-primary bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 no-underline"
              >
                Contact Us
              </a>
              <Link
                href="/about"
                className="btn bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 no-underline"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
    </>
  );
}
