    import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I got 3 interviews in the first week of using my new resume. CareerForge was a game-changer after months of getting no replies.",
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    // Using randomuser.me for placeholder images
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "As a recent grad, I had no idea how to write a professional resume. The AI suggestions were incredible and helped me highlight my projects perfectly.",
    name: "Michael Chen",
    title: "Junior UX Designer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "The cover letter generator saved me hours of work. I could create a unique, tailored letter for each application in about 30 seconds.",
    name: "Emily Rodriguez",
    title: "Marketing Manager",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const Testimonials = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Don't Just Take Our Word For It</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            See how CareerForge has helped professionals land their dream jobs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border border-border transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2"
            >
              <p className="text-foreground/90 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/48x48/E0E7FF/4F46E5?text=${testimonial.name.charAt(0)}`;
                  }}
                />
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;