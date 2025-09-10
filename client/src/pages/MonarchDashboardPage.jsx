import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from "@/components/ui/checkbox";
import { getAnalyticsOverview } from '@/api/adminServiceApi'; // Using your existing API service
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import {
  Crown,
  Users,
  HeartPulse,
  MessageSquareQuote,
  Coins,
  Swords,
  ShieldQuestion,
  Target,
  BookOpen,
  Sprout,
  BookUser,
  BrainCircuit,
} from 'lucide-react';

// --- Static Data ---
// This data doesn't change, so it can live here.
const initialDailyQuests = [
  { id: 1, text: "Code the one most critical feature chunk.", class: "Architect", completed: false },
  { id: 2, text: "Squash bugs for 1 hour.", class: "Architect", completed: false },
  { id: 3, text: "Post 1 insightful thing on social media.", class: "Herald", completed: false },
  { id: 4, text: "Engage with 5 people in your industry.", class: "Herald", completed: false },
  { id: 5, text: "Respond to all user feedback within 3 hours.", class: "Emissary", completed: false },
  { id: 6, text: "Review Core Stats & set Goal of the Day.", class: "Monarch", completed: false },
];

const classSystemData = [
    { 
        title: "The Architect (Product & Engineering)", 
        icon: ShieldQuestion,
        subclasses: [
            { name: "Master Builder", quests: ["Code the one most critical feature for the week.", "Allocate 1 hour daily to 'Bug Squashing'.", "Refactor 1 piece of bad code daily."], levelUp: "Shipping a new feature or major improvement." },
            { name: "Fortress Guardian", quests: ["Check system health for 15 mins daily.", "Ensure your deployment pipeline is smooth.", "Optimize one slow query or process per week."], levelUp: "Reducing server costs or improving site speed by >10%." },
            { name: "Quality Assessor", quests: ["Spend 30 mins daily using your product like a brand new, angry user.", "Write down every single frustration.", "Create a 'Known Bugs' list and prioritize it."], levelUp: "Finding and logging a critical bug before a user does." },
        ]
    },
    { 
        title: "The Herald (Marketing & Growth)", 
        icon: Sprout,
        subclasses: [
             { name: "Town Crier", quests: ["Post 1 insightful thing (not just a promo) daily.", "Share your progress transparently.", "Engage with 5 people in your industry's conversations."], levelUp: "Getting >10 organic likes/shares on a post." },
             { name: "Storyteller", quests: ["Write 300 words for a blog post daily.", "Create 1 short video/GIF of a cool feature per week.", "Document your journey."], levelUp: "A user signs up directly from your content." },
             { name: "Pathfinder", quests: ["Find 10 potential users/influencers on forums daily.", "Send 3 non-spammy, genuinely helpful DMs/emails.", "Find 1 relevant keyword and use it in your content."], levelUp: "Getting a reply or a mention from your outreach." },
        ]
    },
    { 
        title: "The Emissary (Community & Support)", 
        icon: BookUser,
        subclasses: [
            { name: "First Responder", quests: ["Respond to every user email/comment within 3 hours.", "Create template responses for common questions.", "Turn every complaint into a mission."], levelUp: "Turning a user's problem into a positive experience." },
            { name: "Spymaster", quests: ["Actively ask new users for feedback.", "Create a simple public feedback board or Discord.", "Tag and categorize all feedback."], levelUp: "A user provides a game-changing feature idea." },
        ]
    },
    { 
        title: "The Monarch (Strategy & Operations)", 
        icon: BrainCircuit,
        subclasses: [
            { name: "Grand Strategist", quests: ["Review Core Stats daily (15 mins).", "Set a single, clear 'Goal of the Day'.", "Review the day's progress in the evening (15 mins)."], levelUp: "Making a difficult decision that positively impacts Core Stats." },
            { name: "Quartermaster", quests: ["Maintain a simple To-Do list (Today, Week, Backlog).", "Define the 'Weekly Main Quest' every Monday.", "Be ruthless in prioritizing tasks that serve the Main Quest."], levelUp: "Completing the Weekly Main Quest ahead of schedule." },
        ]
    },
];


const MonarchDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dailyQuests, setDailyQuests] = useState(initialDailyQuests);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const overviewData = await getAnalyticsOverview(); 
                
                // IMPORTANT: Adjust the property names below to match what your API actually returns.
                const monarchStats = {
                    activeUsers: overviewData.totalUsers || 0,
                    engagementRate: overviewData.engagementRate || 0,
                    feedbackPoints: overviewData.feedbackCount || 0,
                    revenue: overviewData.totalRevenue || 0
                };

                setStats(monarchStats);
                setError(null);
            } catch (err) {
                setError(err.message || 'Could not load Kingdom Status.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []); // Empty dependency array means this runs once on component mount

    const handleQuestToggle = (id) => {
        setDailyQuests(quests =>
            quests.map(quest =>
                quest.id === id ? { ...quest, completed: !quest.completed } : quest
            )
        );
    };

    const coreStatsConfig = {
      activeUsers: { goal: 1000, label: "Active Users (AU)", icon: Users },
      engagementRate: { goal: 50, label: "Engagement Rate (ER %)", icon: HeartPulse },
      feedbackPoints: { goal: 500, label: "Feedback/Data Points (FDP)", icon: MessageSquareQuote },
      revenue: { goal: 100, label: "Revenue (Gold)", icon: Coins },
    };


  return (
    <>
      <Helmet>
        <title>The Monarch's Dashboard</title>
        <meta name="description" content="Your personal command center for shaking the industry." />
      </Helmet>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-background text-foreground min-h-[calc(100vh-100px)]">
        
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3.5 mb-2">
            <Crown className="h-9 w-9 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              The Monarch's Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Main Quest: Shake the Resume Builder Industry. <span className="font-semibold text-foreground">Time Limit: 30 Days.</span>
          </p>
        </motion.header>

        <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3"><Users className="h-6 w-6 text-muted-foreground"/>Kingdom Status: Your XP Gauge</h2>
            {isLoading && <div className="flex justify-center p-8"><LoadingSpinner label="Surveying the Kingdom..." /></div>}
            {error && <Card className="bg-destructive/10 border-destructive"><CardContent className="p-4"><p className="text-center text-destructive-foreground">{error}</p></CardContent></Card>}
            {stats && !isLoading && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {Object.entries(stats).map(([key, value]) => {
                        const config = coreStatsConfig[key] || {};
                        const Icon = config.icon || Users;
                        return (
                            <motion.div key={key} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{config.label || key}</CardTitle>
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{value}</div>
                                        <p className="text-xs text-muted-foreground">Goal: {config.goal || 'N/A'}</p>
                                        <Progress value={(value / (config.goal || 1)) * 100} className="mt-2 h-2" />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3"><Swords className="h-6 w-6 text-muted-foreground"/>The Daily Decree: Quests</h2>
                    <Card className="shadow-md">
                        <CardContent className="p-6 space-y-4">
                            {dailyQuests.map(quest => (
                                <div key={quest.id} className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={`quest-${quest.id}`} 
                                        checked={quest.completed}
                                        onCheckedChange={() => handleQuestToggle(quest.id)}
                                        aria-label={quest.text}
                                    />
                                    <label
                                        htmlFor={`quest-${quest.id}`}
                                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${quest.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                        {quest.text} <span className="text-xs font-semibold text-primary/80 ml-2">({quest.class})</span>
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3"><BookOpen className="h-6 w-6 text-muted-foreground"/>The Royal Archives: Class & Skill Tree</h2>
                    <Accordion type="single" collapsible className="w-full">
                       {classSystemData.map((classInfo, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                           <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3">
                                <classInfo.icon className="h-5 w-5"/> {classInfo.title}
                            </div>
                           </AccordionTrigger>
                           <AccordionContent className="pl-4 space-y-4">
                                {classInfo.subclasses.map((sub, subIndex) => (
                                    <div key={subIndex} className="border-l-2 border-primary/20 pl-4">
                                        <h4 className="font-bold text-primary">{sub.name}</h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground my-1 space-y-1">
                                            {sub.quests.map((q, i) => <li key={i}>{q}</li>)}
                                        </ul>
                                        <p className="text-xs font-semibold mt-2 text-foreground/80">
                                            <span className="font-bold">Level-Up:</span> {sub.levelUp}
                                        </p>
                                    </div>
                                ))}
                           </AccordionContent>
                         </AccordionItem>
                       ))}
                    </Accordion>
                </div>

            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3"><Target className="h-6 w-6 text-muted-foreground"/>Weekly Battleplan</h2>
                    <Card className="bg-primary/5 border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle>This Week's Main Quest</CardTitle>
                            <CardDescription>The one objective that matters most.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-foreground">
                                Launch the new AI-Powered Summary feature.
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                All quests should serve this goal. Defer anything that does not. Be ruthless in your focus.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default MonarchDashboardPage;