import { useState } from "react";

const CONTACT_EMAIL = "Braian_019@hotmail.com";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="section-wrap py-24" id="contact">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="section-label mb-3">Get in touch</p>
          <h2 className="font-display mb-4 text-[clamp(2.25rem,5vw,3.4rem)] font-extrabold text-white">
            Contact <span className="grad-text">me</span>
          </h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Send me an email if you need more information. I will get back to
            you as soon as possible.
          </p>
        </div>

        <div className="glass relative overflow-hidden rounded-lg p-6 md:p-9">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-300 via-violet-500 to-transparent"></div>

          {submitted && (
            <p className="mb-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-200">
              Your email client should have opened. Thank you for reaching out!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="font-display mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="contact-input"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="font-display mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="contact-input"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="font-display mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your idea..."
                className="contact-input resize-y"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-modern w-full">
              Send Message
              <i className="bx bx-send text-lg"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
