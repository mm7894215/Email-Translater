"use client";

import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';

// Sparkles effect component
const Sparkles = () => {
  return (
    <div className="absolute inset-0 -z-10">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 w-0.5 animate-sparkle rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

// Stats component
const Stats = () => {
  return (
    <div className="mx-auto mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
      {[
        { number: "10K+", label: "Emails Analyzed" },
        { number: "50+", label: "AI Models" },
        { number: "99%", label: "Accuracy Rate" },
        { number: "24/7", label: "Support" },
      ].map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <span className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {stat.number}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className="dark:text-white text-black opacity-0 text-xl"
                style={{
                  filter: filter ? "blur(10px)" : "none",
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      navigate('/translate');
    } else {
      openSignIn();
    }
  };

  useEffect(() => {
    const gridElement = document.querySelector('[data-dark-mode]') as HTMLElement;
    const updateGridBackground = () => {
      if (gridElement) {
        const isDark = document.documentElement.classList.contains('dark');
        gridElement.style.backgroundImage = isDark 
          ? gridElement.getAttribute('data-dark-mode') || ''
          : `
              linear-gradient(to right, rgba(31, 31, 31, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(31, 31, 31, 0.08) 1px, transparent 1px)
            `;
      }
    };

    // Initial update
    updateGridBackground();

    // Create observer to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateGridBackground();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-[100vh] w-full flex items-center justify-center bg-white dark:bg-black overflow-hidden">
      <Sparkles />
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(31, 31, 31, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(31, 31, 31, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        data-dark-mode={`
          linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
        `}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black" />
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-sm"
        >
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-teal-400" />
          <span className="text-neutral-600 dark:text-neutral-400">
            New AI Models Available
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400"
        >
          Email Analyzer Pro
        </motion.h1>

        {/* Description */}
        <TextGenerateEffect
          words="Transform your email communication with AI-powered analysis. Advanced email analysis tool for professionals."
          className="mt-4 font-normal max-w-2xl text-sm md:text-base"
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Button 
            className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={handleClick}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 dark:bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              <SignedIn>Get Started</SignedIn>
              <SignedOut>Sign In</SignedOut>
              <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-full border-neutral-300 dark:border-neutral-700"
            onClick={() => window.open('https://github.com/mm7894215/Email-Translater', '_blank')}
          >
            <IconBrandGithub className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </motion.div>

        {/* Stats */}
        <Stats />
      </div>
    </div>
  );
};
