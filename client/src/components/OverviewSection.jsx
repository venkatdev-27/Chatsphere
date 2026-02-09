import React from "react";

const OverviewSection = () => {
  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-400">
          What is ChatSphere?
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            ChatSphere is a modern real-time messaging platform designed for
            fast, reliable, and meaningful communication. Whether you're chatting
            one-on-one or collaborating in groups, every interaction feels smooth,
            responsive, and intuitive.
          </p>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Built with performance and security at its core, ChatSphere offers
            instant messaging, online presence, media sharing, and seamless
            synchronization across devices — all wrapped in a clean,
            distraction-free interface.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
