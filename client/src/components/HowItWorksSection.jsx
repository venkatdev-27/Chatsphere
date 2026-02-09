import React from "react";
import { UserPlus, MessageCircle, Zap } from "lucide-react";

const HowItWorksSection = () => {
    const steps = [
        {
            step: 1,
            title: "Create an Account",
            description: "Sign up in seconds. All you need is an email address to get started.",
            icon: <UserPlus className="w-12 h-12 text-indigo-400 mb-4" />,
        },
        {
            step: 2,
            title: "Add Your Friends",
            description: "Search for users or invite your contacts to join your network.",
            icon: <MessageCircle className="w-12 h-12 text-indigo-400 mb-4" />,
        },
        {
            step: 3,
            title: "Start Chatting",
            description: "Create groups or direct messages and communicate instantly.",
            icon: <Zap className="w-12 h-12 text-indigo-400 mb-4" />,
        },
    ];

    return (
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        How it works
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need for seamless communication
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                    {steps.map((item, index) => (
                        <div
                            key={item.step}
                            className="flex-1 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 flex flex-col items-center text-center relative group"
                        >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold border-4 border-gray-900 z-20">
                                {item.step}
                            </div>

                            <div className="mt-8 mb-6 p-4 bg-gray-900/50 rounded-full inline-flex items-center justify-center group-hover:bg-indigo-900/20 transition-colors">
                                {item.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-4 text-white">
                                {item.title}
                            </h3>

                            <p className="text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
