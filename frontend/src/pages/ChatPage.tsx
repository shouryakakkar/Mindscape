import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Shield, 
  Phone,
  AlertCircle,
  Lightbulb,
  Smile
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'support' | 'urgent' | 'tip';
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hello! I'm your AI wellness companion. I'm here to provide mental health support, coping strategies, and a safe space to talk. How are you feeling today?",
    timestamp: new Date(),
    category: 'support'
  }
];

const copingStrategies = [
  "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
  "Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 6. Repeat 5 times.",
  "Take a mindful walk, focusing on each step and your surroundings.",
  "Write down three things you're grateful for today, no matter how small.",
  "Listen to calming music or nature sounds for 10 minutes."
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with mental health support
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let category: 'support' | 'urgent' | 'tip' = 'support';

    // Crisis detection (expanded)
    const crisisPatterns = [
      'hurt myself', 'suicide', 'end it all', 'kill myself', 'self harm', 'cut myself',
      'no reason to live', 'want to die', 'ending my life'
    ];
    if (crisisPatterns.some(p => input.includes(p))) {
      category = 'urgent';
      response = "I'm really concerned about you. Please reach out to a crisis helpline immediately:\n\n" +
        "🇺🇸 988 Suicide & Crisis Lifeline: 988\n" +
        "🇬🇧 Samaritans: 116 123\n" +
        "🇮🇳 AASRA: +91-9820466726\n\n" +
        "Your life has value, and help is available. Would you like me to help you find local resources?";
    }
    // Anxiety (expanded)
    else if (/(anxious|anxiety|panic|panic attack|worry|worried)/.test(input)) {
      category = 'support';
      const extra = [
        'Box breathing: inhale 4, hold 4, exhale 4, hold 4 — repeat for 2 minutes.',
        'Name and validate the feeling: “I notice anxiety in my body; it will pass.”',
        'Try a 3-minute mindfulness body scan to ground yourself.',
      ];
      const pick = extra[Math.floor(Math.random() * extra.length)];
      response = `I understand you're feeling anxious. Here's a helpful technique:\n\n${copingStrategies[Math.floor(Math.random() * copingStrategies.length)]}\n\nAnother option: ${pick}\n\nWould you like a short breathing exercise or to book a session with a counselor?`;
    }
    // Depression (expanded)
    else if (/(depressed|sad|down|empty|numb|low mood)/.test(input)) {
      category = 'support';
      response = "I hear this is really hard. Low mood can drain energy and motivation. Small steps help:\n\n" +
        "• Move your body gently (a 5–10 min walk counts)\n" +
        "• Connect with someone you trust\n" +
        "• Do one small valued action (drink water, shower, open a window)\n\n" +
        "If this persists or worsens, consider talking to a counselor. I'm here for you — would you like tips tailored to your routine?";
    }
    // Stress / burnout (expanded)
    else if (/(stress|overwhelmed|pressure|burnout|too much work|deadline)/.test(input)) {
      category = 'tip';
      response = `Academic stress is common. Practical steps:\n\n• Break tasks into 25–45 min focus blocks with short breaks\n• Prioritize top 1–3 tasks only\n• Reduce cognitive load: write to-dos, set timers\n• Add a brief restoration ritual after study (stretching, water)\n\nWant me to generate a one-hour study plan for you?`;
    }
    // Sleep issues
    else if (/(sleep|insomnia|can't sleep|cant sleep|no sleep|awake)/.test(input)) {
      category = 'tip';
      response = "Sleep struggles are tough. Try this tonight:\n\n" +
        "• Keep lights dim 60–90 minutes before bed\n" +
        "• No caffeine after mid‑afternoon\n" +
        "• Use bed only for sleep; if awake >20 mins, do a calm activity until sleepy\n" +
        "• Try a slow 4‑7‑8 breath cycle for 3 minutes\n\nWould you like a guided sleep routine or resource suggestions?";
    }
    // Exam anxiety
    else if (/(exam|exams|test|tests|results|grades)/.test(input)) {
      category = 'support';
      response = "Exam stress can spike anxiety. A plan helps:\n\n" +
        "• Quick review: 10 flashcards + 1 past question\n" +
        "• Calm reset: 90‑second breathing\n" +
        "• Reassess: what’s the smallest next step?\n\nWant a 30‑minute focused plan for your next topic?";
    }
    // General positive responses
    else if (/(good|great|fine|better|okay|ok)/.test(input)) {
      category = 'tip';
      response = "That's good to hear! Consider noting what supported this mood (sleep, socializing, activity). Tracking what works helps build resilience. Anything you'd like to keep doing this week?";
    }
    // Default supportive response
    else {
      category = 'support';
      response = "Thank you for sharing with me. I'm here to listen and support you. Everyone's mental health journey is unique, and it takes courage to reach out.\n\nWhat would be most helpful for you right now? I can offer coping strategies, help you find resources, or generate a step-by-step plan.";
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      category
    };
  };

  const quickActions = [
    { text: "I'm feeling anxious", icon: AlertCircle },
    { text: "I need coping strategies", icon: Lightbulb },
    { text: "I'm having a good day", icon: Smile },
    { text: "I want to book a session", icon: Phone },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 mr-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MindscapeAI is here for you!</h1>
              <p className="text-muted-foreground">Safe, confidential, available 24/7</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="glass">
              <Shield className="w-3 h-3 mr-1" />
              Confidential
            </Badge>
            <Badge variant="secondary" className="glass">
              <Heart className="w-3 h-3 mr-1" />
              Stigma-Free
            </Badge>
            <Badge variant="secondary" className="glass">
              <Phone className="w-3 h-3 mr-1" />
              Crisis Support Available
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <div className="glass-card h-[90vh] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                )}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : message.category === 'urgent'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl whitespace-pre-line",
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : message.category === 'urgent'
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs glass hover-glass"
                  onClick={() => setInputValue(action.text)}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.text}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="glass border-border/30"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                className="rounded-xl hover-glass"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass-card mt-6 text-center text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mx-auto mb-2 text-warning" />
          <p>
            This AI provides general wellness support and is not a replacement for professional therapy. 
            If you're in crisis, please contact emergency services or a crisis helpline immediately.
          </p>
        </div>
      </div>
    </div>
  );
}