import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Note {
    id: string;
    timestamp: string;
    text: string;
}

export interface ChatMessage {
    id: string;
    variant: 'user' | 'ai';
    message: string;
}

export type ActiveTab = 'notes' | 'chat';

interface AppContextType {
    notes: Note[];
    chatMessages: ChatMessage[];
    activeTab: ActiveTab;
    addNote: (text: string) => void;
    addChatMessage: (message: string) => void;
    setActiveTab: (tab: ActiveTab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DUMMY_NOTES: Note[] = [
    { id: '1', timestamp: '12:39 PM', text: 'Meeting with the event coordinator went well. We need to finalize the menu by Tuesday.' },
    { id: '2', timestamp: '2:15 PM', text: 'Checked out the venue again to measure the stage area for the band. It looks spacious enough.' },
    { id: '3', timestamp: '4:45 PM', text: 'Reminder: Send the guest list to the security team by end of day.' },
    { id: '4', timestamp: '10:00 AM', text: 'Budget review call joined. We are slightly under budget for decorations.' },
    { id: '5', timestamp: '11:20 AM', text: 'Called the bakery. Cake tasting is scheduled for Saturday morning. Chocolate vs Vanilla?' },
    { id: '6', timestamp: '1:00 PM', text: 'Lunch with Sarah to discuss the surprise gift. She has some great ideas.' },
    { id: '7', timestamp: '3:30 PM', text: 'Vendor payments processed. All deposits are now cleared.' },
    { id: '8', timestamp: '6:00 PM', text: 'Drafted the welcome speech. Need to keep it under 5 minutes.' },
    { id: '9', timestamp: '9:15 AM', text: 'Morning check-in with the team. Everyone is on track for the deadlines.' },
    { id: '10', timestamp: '8:45 PM', text: 'Reviewing the playlist one last time. Adding a few more classics.' },
];

const DUMMY_CHAT: ChatMessage[] = [
    { id: '1', variant: 'user', message: 'Hey, how are things looking for the party?' },
    { id: '2312', variant: 'ai', message: 'Things are on track! Here is what we have so far:\n\nVenue booked for Saturday\nCatering confirmed for 50 guests\nMusic playlist curated' },
    { id: '3', variant: 'user', message: 'That sounds great! What about the decorations?' },
    { id: '4', variant: 'ai', message: 'I have ordered the balloons and streamers. They should arrive by Friday.' },
    { id: '5', variant: 'user', message: 'Perfect. Did we invite Sarah and Mike?' },
    { id: '6', variant: 'ai', message: 'Yes, invitations were sent to them yesterday. Waiting for their RSVP.' },
    { id: '7', variant: 'user', message: 'Can you remind me what the theme is again?' },
    { id: '8', variant: 'ai', message: 'The theme is "Roaring Twenties". Think Gatsby style - gold, black, and art deco.' },
    { id: '9', variant: 'user', message: 'Right! I need to find a costume.' },
    { id: '10', variant: 'ai', message: 'I can suggest some rental places nearby if you like?' },
    { id: '11', variant: 'user', message: 'Yes please, send me a list.' },
    { id: '12', variant: 'ai', message: 'Here are a few top-rated ones:\n\nVintage Vogue Rentals\nCostume Castle\nRetro Fit Outfitters' },
    { id: '13', variant: 'user', message: 'Thanks! Also, are we doing a cake?' },
    { id: '14', variant: 'ai', message: 'Absolutely! A three-tier deco-style cake has been ordered from Sweet Dreams Bakery.' },
    { id: '15', variant: 'user', message: 'What flavor did we pick?' },
    { id: '16', variant: 'ai', message: 'Chocolate ganache with raspberry filling. A classic choice.' },
    { id: '17', variant: 'user', message: 'Yum. What about drinks?' },
    { id: '18', variant: 'ai', message: 'We have a mixologist hired for the night. They will be serving prohibition-era cocktails like Old Fashioneds and Gin Rickeys.' },
    { id: '19', variant: 'user', message: 'Sounds amazing. I am really looking forward to it.' },
    { id: '20', variant: 'ai', message: 'It is going to be a fantastic night! Let me know if you need anything else.' },
];

const AI_RESPONSES = [
    "That sounds like a great plan! The 30th birthday is going to be unforgettable.",
    "I'm updating the schedule now. Everything is looking good.",
    "Don't worry about the details, we're on track.",
    "Have you thought about adding a photo booth? It's always a hit.",
    "The RSVPs are coming in. We're at 40 confirmed guests so far.",
    "I'll double-check with the caterer about dietary restrictions.",
    "Music playlist is updated with your suggestions.",
    "Lighting setup is confirmed for the evening.",
    "Just a reminder to pick up the party favors.",
    "It's going to be an amazing night!",
    "I've noted that down. Anything else on your mind?",
    "Great idea! Adding it to the list."
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<Note[]>(DUMMY_NOTES);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DUMMY_CHAT);
    const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
    const [isAITyping, setIsAITyping] = useState(false);

    const addNote = (text: string) => {
        const now = new Date()
        const timestamp = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const newNote: Note = {
            id: Date.now().toString(),
            timestamp,
            text,
        };
        setNotes((prev) => [...prev, newNote]);
    };

    const addChatMessage = (message: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString() + Math.random().toString(),
            variant: 'user',
            message,
        };
        setChatMessages((prev) => [...prev, newMessage]);
    };

    useEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        if (lastMessage && lastMessage.variant === 'user' && !isAITyping) {
            setIsAITyping(true);
            
            const initialDelay = Math.random() * 1000 + 1000;
            
            setTimeout(() => {
                const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
                const words = randomResponse.split(' ');
                let currentText = "";
                
                const aiMessageId = Date.now().toString() + Math.random().toString();
                let wordIndex = 0;

                setChatMessages(prev => [...prev, { id: aiMessageId, variant: 'ai', message: '' }]);

                const typeInterval = setInterval(() => {
                    if (wordIndex < words.length) {
                        currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
                        setChatMessages(prev => prev.map(msg => 
                            msg.id === aiMessageId ? { ...msg, message: currentText } : msg
                        ));
                        wordIndex++;
                    } else {
                        clearInterval(typeInterval);
                        setIsAITyping(false);
                    }
                }, 150);

            }, initialDelay);
        }
    }, [chatMessages, isAITyping]);

    return (
        <AppContext.Provider value={{ notes, chatMessages, activeTab, addNote, addChatMessage, setActiveTab }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
