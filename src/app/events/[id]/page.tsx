'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function EventDetails() {
  const params = useParams();
  const id = params.id;

  const images = [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-base-200/50">
          <div className="container mx-auto px-4 py-3">
            <div className="text-sm breadcrumbs">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li>Event Details</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg group">
                {/* Previous Button */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image */}
                <Image
                  src={images[currentImage]}
                  alt="Event Image"
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index 
                          ? 'bg-white w-4' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">Music</span>
                    <span className="badge badge-ghost">Featured</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Summer Music Festival</h1>
                  <p className="text-white/80">Experience the ultimate summer music festival featuring top artists.</p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="mt-3 grid grid-cols-6 gap-2 px-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative h-16 rounded-md overflow-hidden ${
                      currentImage === index 
                        ? 'ring-2 ring-primary ring-offset-1' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Event Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Event Details Tabs */}
              <div className="mt-8">
                <div className="tabs tabs-boxed">
                  <a className="tab tab-active">Overview</a>
                  <a className="tab">Schedule</a>
                  <a className="tab">Location</a>
                  <a className="tab">Reviews</a>
                </div>
                <div className="mt-4 p-4 bg-base-200 rounded-lg border-2 border-base-300">
                  <h3 className="text-lg font-semibold mb-4">Event Description</h3>
                  <p className="text-base-content/80 leading-relaxed">
                    Join us for an unforgettable experience at the Summer Music Festival! 
                    Featuring live performances from top artists, food vendors, and amazing activities.
                    Don't miss out on the biggest music event of the summer.
                  </p>
                  
                  <div className="divider"></div>
                  
                  <h3 className="text-lg font-semibold mb-4">Event Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>Live performances from top artists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>Food and beverage vendors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>Interactive activities and games</span>
                    </li>
                  </ul>

                  <div className="divider"></div>

                  <h3 className="text-lg font-semibold mb-4">Event Rules & Restrictions</h3>
                  <div className="bg-base-300/50 rounded-lg p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium">Age Restriction</span>
                          <p className="text-sm text-base-content/70">No persons under 16 years of age will be admitted</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium">No Weapons</span>
                          <p className="text-sm text-base-content/70">Weapons of any kind are strictly prohibited</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium">No Professional Cameras</span>
                          <p className="text-sm text-base-content/70">Professional photography equipment is not allowed</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium">No Pets</span>
                          <p className="text-sm text-base-content/70">Pets are not allowed at the venue (service animals excepted)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium">Cooler Boxes Allowed with Pass</span>
                          <p className="text-sm text-base-content/70">Cooler boxes (max 50L) permitted with purchase of Cooler Box Pass</p>
                        </div>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                      <p className="text-sm text-warning-content/80">
                        <span className="font-medium">Note:</span> Violation of any of these rules may result in denial of entry or removal from the event without refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="card bg-base-100 shadow-xl border-2 border-base-300">
                  <div className="card-body">
                    <h2 className="card-title">Event Details</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-base-200 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Date</p>
                          <p className="font-medium">July 15, 2024</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-base-200 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Location</p>
                          <p className="font-medium">Lagos Beach Resort</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-base-200 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Price</p>
                          <p className="font-medium">₦5,000</p>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Select Ticket Type</span>
                          <span className="badge badge-success">Available</span>
                        </div>

                        {/* Regular Ticket */}
                        <div className="p-3 border-2 border-base-300 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Regular Ticket</h4>
                              <p className="text-sm text-base-content/70">General admission</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₦5,000</div>
                              <span className="text-sm text-success">50 left</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <select className="select select-bordered select-sm flex-1">
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                            <button className="btn btn-primary btn-sm">Add</button>
                          </div>
                        </div>

                        {/* VIP Ticket */}
                        <div className="p-3 border-2 border-primary rounded-lg space-y-3 bg-primary/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">VIP Ticket</h4>
                                <span className="badge badge-primary badge-sm">POPULAR</span>
                              </div>
                              <p className="text-sm text-base-content/70">Premium seating + Meet & Greet</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₦15,000</div>
                              <span className="text-sm text-warning">Only 10 left</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <select className="select select-bordered select-sm flex-1">
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                            <button className="btn btn-primary btn-sm">Add</button>
                          </div>
                        </div>

                        {/* VVIP Ticket */}
                        <div className="p-3 border-2 border-secondary rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">VVIP Ticket</h4>
                              <p className="text-sm text-base-content/70">Exclusive access + Backstage tour</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₦25,000</div>
                              <span className="text-sm text-error">Only 5 left</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <select className="select select-bordered select-sm flex-1">
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                            <button className="btn btn-primary btn-sm">Add</button>
                          </div>
                        </div>

                        {/* Cooler Box Pass */}
                        <div className="p-3 border-2 border-accent rounded-lg space-y-3 bg-accent/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Cooler Box Pass</h4>
                                <span className="badge badge-accent badge-sm">OPTIONAL</span>
                              </div>
                              <p className="text-sm text-base-content/70">Bring your own drinks and snacks (max size: 50L)</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">₦2,000</div>
                              <span className="text-sm text-success">Available</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <select className="select select-bordered select-sm flex-1">
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                            </select>
                            <button className="btn btn-accent btn-sm">Add</button>
                          </div>
                          <div className="text-xs text-base-content/70 mt-1">
                            * One pass required per cooler box. Maximum 2 per person.
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-base-200 p-4 rounded-lg space-y-3">
                          <h4 className="font-medium">Order Summary</h4>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₦0</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Service fee</span>
                              <span>₦0</span>
                            </div>
                            <div className="divider my-1"></div>
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>₦0</span>
                            </div>
                          </div>
                        </div>

                        <button className="btn btn-primary w-full">Proceed to Checkout</button>
                      </div>

                      <div className="flex justify-center gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Save
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="card bg-base-100 shadow-xl mt-4 border-2 border-base-300">
                  <div className="card-body">
                    <h3 className="card-title">Organizer</h3>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="Organizer" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">EventPro Nigeria</p>
                        <p className="text-sm text-base-content/70">Verified Organizer</p>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm mt-2">Contact Organizer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
