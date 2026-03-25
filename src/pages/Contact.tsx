import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-leaf mb-8 text-center">Contact Us</h1>
        <p className="text-center text-ink/70 mb-12">We're here to help you find the perfect everlasting arrangement. Reach out to us with any questions or special requests.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="font-serif text-2xl text-deep-leaf mb-4">Get in Touch</h3>
            <div className="space-y-4 text-ink/80">
              <p>
                <strong className="block text-ink font-medium uppercase tracking-widest text-xs mb-1">Email</strong>
                <a href="mailto:rmflowers42@gmail.com" className="hover:text-deep-leaf transition-colors">rmflowers42@gmail.com</a>
              </p>
              <p>
                <strong className="block text-ink font-medium uppercase tracking-widest text-xs mb-1">Phone / WhatsApp</strong>
                <a href="https://wa.me/918793326295" target="_blank" rel="noopener noreferrer" className="hover:text-deep-leaf transition-colors">+91 87933 26295</a>
              </p>
              <p>
                <strong className="block text-ink font-medium uppercase tracking-widest text-xs mb-1">Business Hours</strong>
                Monday - Saturday<br />
                10:00 AM - 7:00 PM IST
              </p>
            </div>
          </div>
          
          <div className="bg-soft-rose/10 p-8 border border-soft-rose/30">
            <h3 className="font-serif text-xl text-deep-leaf mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your message. We will get back to you soon!'); }}>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Name</label>
                <input type="text" required className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Email</label>
                <input type="email" required className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1">Message</label>
                <textarea required rows={4} className="w-full border border-soft-rose/50 bg-clean-white px-4 py-2 text-sm focus:outline-none focus:border-deep-leaf resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-deep-leaf text-clean-white h-12 uppercase tracking-widest text-sm font-bold hover:bg-ink transition-colors mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
