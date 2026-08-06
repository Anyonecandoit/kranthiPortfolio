"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Mail, Linkedin, ExternalLink } from "lucide-react";

export function Contact() {
  const { contact } = resumeData;

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          label="Contact"
          title="Let's work together"
          description="Open to opportunities and interesting conversations about test automation."
        />

        <Reveal delay={0.2} y={24}>
          <SpotlightCard className="p-6 md:p-12 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-10">
              <motion.a
                href={`mailto:${contact.email}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <Mail size={28} className="text-violet-400" />
                </div>
                <span className="text-sm font-medium text-gray-400">Email</span>
                <span className="text-lg font-semibold text-white truncate max-w-xs">{contact.email}</span>
              </motion.a>

              <motion.a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Linkedin size={28} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-400">LinkedIn</span>
                <span className="text-lg font-semibold text-white truncate max-w-xs">
                  {contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </motion.a>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-500 text-sm"
            >
              Usually replies within 24 hours · Available for remote & hybrid roles
            </motion.p>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

/* Export a default version for any import style that expects it */
export default Contact;
