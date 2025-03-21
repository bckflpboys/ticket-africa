'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const faqs = [
  {
    question: "How do I get a refund for a cancelled event?",
    answer: "If an event is cancelled, you'll automatically receive a refund within 5-7 business days. The refund will be processed to the original payment method used for the purchase."
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer: "Yes, you can transfer your ticket to another person through our ticket transfer system. Simply log in to your account, go to 'My Tickets', and select the transfer option."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including credit/debit cards, bank transfers, and mobile money. All payments are processed securely through our platform."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [activeTab, setActiveTab] = useState('message'); // 'message' or 'faq'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message. We will get back to you soon!'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative bg-base-200 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pattern-grid-lg"></div>
          <div className="container mx-auto px-4 text-center relative">
            <div className="inline-block mb-4">
              <div className="badge badge-primary">Support 24/7</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-base-content/80">
              Have questions or need assistance? Our team is here to help you with any inquiries
              about events, tickets, or our platform.
            </p>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="py-12 -mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Support */}
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Email Support</h3>
                      <p className="text-base-content/70">Get help via email</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">support@ticketafrica.com</p>
                    <p className="text-sm text-base-content/70">Response within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Phone Support */}
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Phone Support</h3>
                      <p className="text-base-content/70">Talk to our team</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">+234 (0) 123 456 7890</p>
                    <p className="text-sm text-base-content/70">Mon - Fri, 9am - 6pm WAT</p>
                  </div>
                </div>
              </div>

              {/* Office Visit */}
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Visit Us</h3>
                      <p className="text-base-content/70">Come to our office</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">123 Business District</p>
                    <p className="text-sm text-base-content/70">Victoria Island, Lagos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="tabs tabs-boxed justify-center mb-8">
                <button 
                  className={`tab ${activeTab === 'message' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('message')}
                >
                  Send Message
                </button>
                <button 
                  className={`tab ${activeTab === 'faq' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('faq')}
                >
                  FAQs
                </button>
              </div>

              {/* Contact Form */}
              {activeTab === 'message' && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {submitStatus.message && (
                        <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                          <div>
                            <span>{submitStatus.message}</span>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Name</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="input input-bordered w-full"
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Email</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Subject</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Message</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message"
                          className="textarea textarea-bordered h-32"
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="loading loading-spinner"></span>
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="collapse collapse-arrow bg-base-100 shadow-lg">
                      <input type="radio" name="faq-accordion" /> 
                      <div className="collapse-title text-lg font-medium">
                        {faq.question}
                      </div>
                      <div className="collapse-content">
                        <p className="text-base-content/80">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="card bg-base-100 shadow-xl overflow-hidden">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7277267760097!2d3.4239448!3d6.4280556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4c9f5d7b8a54eb53!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1645432615415!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
