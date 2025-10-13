import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart, Sparkles } from 'lucide-react';

const testimonials = [
  {
    quote: "CareerForge transformed my job search completely. Within a week of using my new resume, I had three interview invitations. The AI suggestions were spot-on and helped me articulate my achievements perfectly.",
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    company: "TechFlow Inc.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    highlight: "3 interviews in 1 week"
  },
  {
    quote: "As a recent graduate, I felt lost creating my first professional resume. CareerForge's guidance was incredible - it helped me showcase my projects and internships in ways I never thought possible.",
    name: "Marcus Rodriguez",
    title: "UX Designer",
    company: "Design Studio Co.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    highlight: "Perfect for new grads"
  },
  {
    quote: "The cover letter generator is a game-changer! I used to spend hours crafting individual letters for each application. Now I create personalized, compelling letters in minutes.",
    name: "Emily Thompson",
    title: "Marketing Director",
    company: "Growth Solutions",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    highlight: "Saves hours of work"
  }
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-accent-pink/5 rounded-full blur-3xl"></div>
        <motion.div
          className="absolute top-32 left-16 opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-8 h-8 text-accent-pink" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-16 opacity-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
      </div>

      {/* _// responsiveness update_: Adjusted padding for consistency */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-16 sm:mb-20" // _// responsiveness update_: Adjusted bottom margin
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-muted-foreground">Success Stories</span>
          </motion.div>

          {/* _// responsiveness update_: Scaled font size across breakpoints */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            Real People,
            <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary/80 bg-clip-text text-transparent">
              Real Success
            </span>
          </h2>
          
          {/* _// responsiveness update_: Scaled font size across breakpoints */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who've transformed their careers with CareerForge.
            See how our AI-powered tools helped them land their dream jobs.
          </p>
        </motion.div>

        {/* This grid is already perfectly responsive. */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent-purple/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* _// responsiveness update_: Adjusted padding for smaller screens */}
              <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-border h-full flex flex-col">
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-primary/30 fill-current" />
                </div>

                {/* _// responsiveness update_: Scaled font size and added flex-grow to handle uneven text lengths */}
                <blockquote className="text-secondary-foreground text-base md:text-lg leading-relaxed mb-8 font-medium flex-grow">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 text-sm font-semibold text-success">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    {testimonial.highlight}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-card"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/56x56/E0E7FF/4F46E5?text=${testimonial.name.charAt(0)}`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                      <div className="w-2 h-2 bg-card rounded-full"></div>
                    </div>
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{testimonial.name}</h4>
                    <p className="text-secondary-foreground font-medium">{testimonial.title}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.company}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Heart className="w-12 h-12 text-accent-pink fill-current" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* This stats grid is also perfectly responsive. */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* _// responsiveness update_: Scaled font size */}
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent mb-2">
                50,000+
              </div>
              <div className="text-muted-foreground font-medium text-sm">Success Stories</div>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* _// responsiveness update_: Scaled font size */}
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-muted-foreground font-medium text-sm">Average Rating</div>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* _// responsiveness update_: Scaled font size */}
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent mb-2">
                95%
              </div>
              <div className="text-muted-foreground font-medium text-sm">Would Recommend</div>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* _// responsiveness update_: Scaled font size */}
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-destructive bg-clip-text text-transparent mb-2">
                2M+
              </div>
              <div className="text-muted-foreground font-medium text-sm">Resumes Created</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;