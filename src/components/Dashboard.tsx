'use client';
import { TournamentCard } from './TournamentCard';
import { CustomPractice } from './CustomPractice';
import { Trophy, Sparkles, FileText } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import type { ITournamentGame } from '../store/useGameStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportStore } from '../store/useReportStore';
import SkeletonLoader from './shared/skeleton-loader';

export function Dashboard() {
  const navigate = useNavigate();
  const { tournametGames, loading, fetchTournamentGames, setSelectedTournamentGame } =
    useGameStore();
  const { report, loading: reportLoading, fetchReport } = useReportStore();
  // use store values directly

  const [_flashGameLevel, setFlashGameLevel] = useState('a1');
  const [_regularGameLevel, setRegularGameLevel] = useState('a1');

  const onMCQPractice = () => navigate('/mcq');

  useEffect(() => {
    fetchTournamentGames();
    fetchReport();
  }, []);

  // no local copy of store state needed

  const onSelectTournament = (tournament: ITournamentGame) => {
    setSelectedTournamentGame(tournament);
    navigate('/game');
  };

  const onCustomPractice = (settings: {
    digitCount: number;
    operations: ('add' | 'subtract')[];
    numberCount: number;
    delay: number;
  }) => {
    const customTournament: ITournamentGame = {
      id: 'custom',
      name: 'Custom Practice',
      // planet: 'Custom Practice',
      digitCount: settings.digitCount,
      operations: settings.operations,
      numberCount: settings.numberCount,
      delay: settings.delay,
      // color: 'from-purple-500 to-pink-600',
      icon: '⚙️',
    };
    setSelectedTournamentGame(customTournament);
    navigate('/game');
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Mental Math Master
          </h1>
          <p className="text-gray-400 text-lg">Choose your planet and master mental math</p>
        </div>

        {/* Stats Bar */}
        {reportLoading ? (
          <SkillProgressionSkeleton />
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-sm border border-white/10">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl text-white">
                    {reportLoading ? (
                      <SkeletonLoader height={30} width={30} radius={8} />
                    ) : (
                      report?.achievements
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">🎯</span>
                  <span className="text-2xl text-white">
                    {reportLoading ? (
                      <SkeletonLoader height={30} width={30} radius={8} />
                    ) : (
                      report?.accuracy
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Accuracy</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">⚡</span>
                  <span className="text-2xl text-white">
                    {reportLoading ? (
                      <SkeletonLoader height={30} width={30} radius={8} />
                    ) : (
                      report?.streak
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Streak</p>
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-between items-start mb-4'>
          <h2 className="text-xl text-white mb-4 px-2">Flash Calculation</h2>
          <LevelSelect onSelectChanged={setFlashGameLevel} />
        </div>

        {/* Tournament Carousel */}
        <div className="mb-8">
          <div className="relative -mx-4 px-4">
            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4">
              {loading ? (
                <TournamentCaraouselSkeleton />
              ) : (
                tournametGames?.map(tournament => (
                  <div key={tournament.id} className="snap-start shrink-0 w-[280px] first:ml-0">
                    <TournamentCard
                      tournament={tournament}
                      onSelect={() => onSelectTournament(tournament)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        <div className='flex justify-between items-start mb-4'>
          <h2 className="text-xl text-white mb-4 px-2">Mental Math Calculation</h2>
          <LevelSelect onSelectChanged={setRegularGameLevel} />
        </div>

        {/* Tournament Carousel */}
        <div className="mb-8">
          <div className="relative -mx-4 px-4">
            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4">
              {loading ? (
                <TournamentCaraouselSkeleton />
              ) : (
                tournametGames?.map(tournament => (
                  <div key={tournament.id} className="snap-start shrink-0 w-[280px] first:ml-0">
                    <TournamentCard
                      tournament={tournament}
                      onSelect={() => onSelectTournament(tournament)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Custom Practice Section */}
        <CustomPractice onStart={onCustomPractice} />

        {/* MCQ Practice Button */}
        {onMCQPractice && (
          <div className="mb-8">
            <button
              onClick={onMCQPractice}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-3xl p-6 shadow-lg transition-all border border-blue-400/20 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-xl mb-1">MCQ Practice</h3>
                    <p className="text-blue-100 text-sm">
                      5 questions · No time limit · Step-by-step navigation
                    </p>
                  </div>
                </div>
                <div className="text-white opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Practice daily to improve your mental calculation speed</p>
        </div>
      </div>
    </div>
  );
}

const TournamentCaraouselSkeleton = () => {
  return (
    <div className="overflow-x-auto scrollbar-hide flex gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8]?.map(tournament => (
        <div key={tournament} className="snap-start shrink-0 w-[280px] first:ml-0">
          <SkeletonLoader height={290} width={278} radius={20} />
        </div>
      ))}
    </div>
  );
};

const SkillProgressionSkeleton = () => {
  return (
    <div style={{ marginBottom: 32 }}>
      <SkeletonLoader height={101} width={'100%'} radius={20} />
    </div>
  );
};

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const LevelSelect = ({ onSelectChanged }: { onSelectChanged: (value: string) => void }) => (
  <Select.Root onValueChange={onSelectChanged}>

    <Select.Trigger
      className={`level-dropdown w-30 inline-flex h-[35px] items-center justify-center px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none text-[#97a2b8]}`}
      aria-label="level"
    >
      <Select.Value placeholder="Select a level" />
      {/* <Select.Icon className="text-violet11 ml-2">
        <ChevronDownIcon />
      </Select.Icon> */}
    </Select.Trigger>

    <Select.Portal>

      <Select.Content className="overflow-hidden rounded-md bg-[#1b2335] text-[#9198a6] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">

        <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center  bg-[#1b2335] text-violet11">
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-[5px]">

          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-green-300">
              Add & Substract
            </Select.Label>
            <SelectItem value="a1">Beginner</SelectItem>
            <SelectItem value="a2">Intermediate</SelectItem>
            <SelectItem value="a3">Advanced</SelectItem>
            <SelectItem value="a4">Pro</SelectItem>
          </Select.Group>

          <hr />

          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-orange-300">
              Multiply
            </Select.Label>
            <SelectItem value="b1">Beginner</SelectItem>
            <SelectItem value="b2">Intermediate</SelectItem>
            <SelectItem value="b3">Advanced</SelectItem>
            <SelectItem value="b4">Pro</SelectItem>
          </Select.Group>

          <hr />

          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-red-400">
              Divide
            </Select.Label>
            <SelectItem value="c1">Beginner</SelectItem>
            <SelectItem value="c2">Intermediate</SelectItem>
            <SelectItem value="c3">Advanced</SelectItem>
            <SelectItem value="c4">Pro</SelectItem>
          </Select.Group>

        </Select.Viewport>

        <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-[#1b2335] text-violet11">
          <ChevronDownIcon />
        </Select.ScrollDownButton>

      </Select.Content>

    </Select.Portal>

  </Select.Root>
);

type SelectItemProps = React.ComponentPropsWithoutRef<typeof Select.Item> & {
  children?: React.ReactNode;
  className?: string;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          'relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-violet11 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none',
          className,
        )}
        {...(props as React.ComponentPropsWithoutRef<typeof Select.Item>)}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = 'SelectItem';
