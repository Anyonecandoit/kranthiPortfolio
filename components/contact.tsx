"use client";

/**
 * Simple Contact component – uses data from resumeData.contact
 * and a solid black background to stay consistent with the theme.
 */
import { resumeData } from "@/data/resume";

export function Contact() {
  const { contact } = resumeData;

  return (
    <section
      id="contact"
      className="py-12 bg-black rounded-xl p-6 shadow-glow focus:outline-none focus:ring-2 focus:ring-violet-400"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        Contact
      </h2>
      <div className="flex flex-col items-center space-y-3 text-center text-white">
        <p>
          Email:{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-violet-400 hover:text-violet-200 transition-colors"
          >
            {contact.email}
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-200 transition-colors"
          >
            {contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        </p>
      </div>
    </section>
  );
}

/* Export a default version for any import style that expects it */
export default Contact;
