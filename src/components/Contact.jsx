import { useState } from "react";

const CONTACT_EMAIL = "Braian_019@hotmail.com";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="my-16 max-w-7xl mx-auto px-5" id="contact">
      <div className="text-center">
        <p className="mb-3 font-montserrat font-medium text-gray-700 dark:text-gray-200">
          Send me an E-mail if you need more information
        </p>
        <h3 className="text-primary text-3xl font-bold mb-16">Contact me</h3>
      </div>

      <div className="container mx-auto flex flex-wrap gap-6 justify-center">
        <div className="border border-primary shadow-[0_4px_20px_var(--color-primary-shadow)] rounded-lg p-6 max-w-sm w-full bg-white/70 dark:bg-background">
          <h2 className="text-2xl font-bold mb-3">Contact Me</h2>
          {submitted && (
            <p className="mb-4 text-green-600 dark:text-green-400 font-medium">
              Your email client should have opened. Thank you for reaching out!
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="message" className="block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-primary text-white font-bold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
