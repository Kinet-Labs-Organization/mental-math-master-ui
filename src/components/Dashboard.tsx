'use client';
import { GameCard } from './GameCard';
import { CustomPractice } from './CustomPractice';
import { Trophy, Sparkles, FileText, Plus, Minus, X, Divide, Zap, Target } from 'lucide-react';
import type { IGame } from '../store/useGameStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from './shared/skeleton-loader';
import { useReportStore } from '../store/useReportStore';
import { useGameStore } from '../store/useGameStore';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    flashGameLevels,
    flashGameLevelsLoading,
    fetchFlashGameLevels,

    regularGameLevels,
    regularGameLevelsLoading,
    fetchRegularGameLevels,

    setSelectedGame
  } = useGameStore();
  const { authenticatedUser } = useUserStore();
  const { fetchBasicReport, basicReport, basicReportLoading } = useReportStore();
  // use store values directly

  const [flashGameLevel, setFlashGameLevel] = useState(() => {
    return CONSTANTS.FLASH_GAME_LEVEL_STORAGE_KEY in localStorage
      ? localStorage.getItem(CONSTANTS.FLASH_GAME_LEVEL_STORAGE_KEY) as string
      : 'ADD_SUB_L1';
  });
  const [regularGameLevel, setRegularGameLevel] = useState(() =>
    CONSTANTS.REGULAR_GAME_LEVEL_STORAGE_KEY in localStorage
      ? localStorage.getItem(CONSTANTS.REGULAR_GAME_LEVEL_STORAGE_KEY) as string
      : 'ADD_SUB_L1'
  );

  const onRegularGame = () => navigate('/regulargame');

  useEffect(() => {
    fetchBasicReport();
  }, []);

  useEffect(() => {
    localStorage.setItem(CONSTANTS.FLASH_GAME_LEVEL_STORAGE_KEY, flashGameLevel);
    fetchFlashGameLevels(flashGameLevel);
  }, [flashGameLevel]);

  useEffect(() => {
    localStorage.setItem(CONSTANTS.REGULAR_GAME_LEVEL_STORAGE_KEY, regularGameLevel);
    fetchRegularGameLevels(regularGameLevel);
  }, [regularGameLevel]);

  // no local copy of store state needed

  const onGameSelect = (tournament: IGame) => {
    setSelectedGame(tournament);
    if (tournament.type === 'regular') {
      navigate('/regulargame');
    } else {
      navigate('/flashgame');
    }
  };

  const onCustomPractice = (settings: {
    digitCount: number;
    operations: string;
    numberCount: number;
    gameType: string;
    delay?: number;
    numberOfQuestions?: number;
  }) => {
    const customTournament = {
      id: 'custom',
      name: 'Custom Practice',
      digitCount: settings.digitCount,
      operations: settings.operations,
      numberCount: settings.numberCount,
      gameType: settings.gameType,
      delay: settings.delay || null,
      numberOfQuestions: settings.numberOfQuestions || null,
      icon: '⚙️',
    };
    setSelectedGame(customTournament);
    navigate(settings.gameType === 'flash' ? '/flashgame' : '/regulargame');
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
            Hi {authenticatedUser.name}
          </h1>
          <p className="text-gray-400 text-lg">Choose your planet and master mental math</p>
        </div>

        {/* Stats Bar */}
        {basicReportLoading ? (
          <SkillProgressionSkeleton />
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-sm border border-white/10">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl text-white">
                    {
                      basicReport?.achievements.length
                    }
                  </span>
                </div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {/* <span className="text-2xl">🎯</span> */}
                  <Target className="w-6 h-6 text-green-500" />
                  <span className="text-2xl text-white">
                    {basicReportLoading ? (
                      <SkeletonLoader height={30} width={30} radius={8} />
                    ) : (
                      basicReport?.accuracyRate
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Accuracy</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {/* <span className="text-2xl">⚡</span> */}
                  <Zap className="w-6 h-6 text-purple-500" />
                  <span className="text-2xl text-white">
                    {basicReportLoading ? (
                      <SkeletonLoader height={30} width={30} radius={8} />
                    ) : (
                      basicReport?.currentStreak
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
          <LevelSelect onSelectChanged={setFlashGameLevel} value={flashGameLevel} />
        </div>

        {/* Tournament Carousel */}
        <div className="mb-8">
          <div className="relative -mx-4 px-4">
            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4">
              {flashGameLevelsLoading ? (
                <TournamentCaraouselSkeleton />
              ) : (
                flashGameLevels?.map((tournament: any) => (
                  <div key={tournament.id} className="snap-start shrink-0 w-[280px] first:ml-0">
                    <GameCard
                      tournament={tournament}
                      onSelect={() => onGameSelect({ ...tournament, type: 'flash' })}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        <div className='flex justify-between items-start mb-4'>
          <h2 className="text-xl text-white mb-4 px-2">Mental Math Calculation</h2>
          <LevelSelect onSelectChanged={setRegularGameLevel} value={regularGameLevel} />
        </div>

        {/* Tournament Carousel */}
        <div className="mb-8">
          <div className="relative -mx-4 px-4">
            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4">
              {regularGameLevelsLoading ? (
                <TournamentCaraouselSkeleton />
              ) : (
                regularGameLevels?.map((tournament: any) => (
                  <div key={tournament.id} className="snap-start shrink-0 w-[280px] first:ml-0">
                    <GameCard
                      tournament={tournament}
                      onSelect={() => onGameSelect({ ...tournament, type: 'regular' })}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Custom Practice Section */}
        <CustomPractice onStart={onCustomPractice} />

        {/* Regular Game Button */}
        {onRegularGame && (
          <div className="mb-8">
            <button
              onClick={onRegularGame}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-3xl p-6 shadow-lg transition-all border border-blue-400/20 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-xl mb-1">Regular Game</h3>
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
import CONSTANTS from '../utils/constants';
import { useUserStore } from '../store/useUserStore';

const LevelSelect = ({ onSelectChanged, value }: { onSelectChanged: (value: string) => void, value: string }) => (
  <Select.Root onValueChange={onSelectChanged} value={value}>

    <Select.Trigger
      className={`level-dropdown w-38 inline-flex h-[35px] items-center justify-center px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none text-[#97a2b8]}`}
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

          <Select.Group className='pb-2'>

            <Select.Label className="px-[25px] text-xs leading-[25px] text-green-300">
              Add & Substract
            </Select.Label>

            <SelectItem value="ADD_SUB_L1">
              <div className='flex items-center gap-1.5'>
                <div className="flex bg-green-500/20 py-1 rounded-full border border-green-500/30 w-12">
                  <Plus className="h-3" />
                  <Minus className="h-3" />
                </div>
                <span>Beginner</span>
              </div>
            </SelectItem>

            <SelectItem value="ADD_SUB_L2">
              <div className='flex items-center gap-1.5'>
                <div className="flex bg-green-500/20 py-1 rounded-full border border-green-500/30 w-12">
                  <Plus className="h-3" />
                  <Minus className="h-3" />
                </div>
                <span>Intermediate</span>
              </div>
            </SelectItem>

            <SelectItem value="ADD_SUB_L3">
              <div className='flex items-center gap-1.5'>
                <div className="flex bg-green-500/20 py-1 rounded-full border border-green-500/30 w-12">
                  <Plus className="h-3" />
                  <Minus className="h-3" />
                </div>
                <span>Advanced</span>
              </div>
            </SelectItem>

            <SelectItem value="ADD_SUB_L4">
              <div className='flex items-center gap-1.5'>
                <div className="flex bg-green-500/20 py-1 rounded-full border border-green-500/30 w-12">
                  <Plus className="h-3" />
                  <Minus className="h-3" />
                </div>
                <span>Pro</span>
              </div>
            </SelectItem>

          </Select.Group>

          <hr />

          <Select.Group className='pb-2'>

            <Select.Label className="px-[25px] text-xs leading-[25px] text-blue-300">
              Multiply
            </Select.Label>

            <SelectItem value="MUL_L1">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-blue-500/20 py-1 rounded-full border border-blue-500/30 w-12">
                  <X className="h-3" />
                </div>
                <span>Beginner</span>
              </div>
            </SelectItem>

            <SelectItem value="MUL_L2">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-blue-500/20 py-1 rounded-full border border-blue-500/30 w-12">
                  <X className="h-3" />
                </div>
                <span>Intermediate</span>
              </div>
            </SelectItem>

            <SelectItem value="MUL_L3">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-blue-500/20 py-1 rounded-full border border-blue-500/30 w-12">
                  <X className="h-3" />
                </div>
                <span>Advanced</span>
              </div>
            </SelectItem>

            <SelectItem value="MUL_L4">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-blue-500/20 py-1 rounded-full border border-blue-500/30 w-12">
                  <X className="h-3" />
                </div>
                <span>Pro</span>
              </div>
            </SelectItem>

          </Select.Group>

          <hr />

          <Select.Group>

            <Select.Label className="px-[25px] text-xs leading-[25px] text-yellow-400">
              Divide
            </Select.Label>

            <SelectItem value="DIV_L1">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-yellow-500/20 py-1 rounded-full border border-yellow-500/30 w-12">
                  <Divide className="h-3" />
                </div>
                <span>Beginner</span>
              </div>
            </SelectItem>

            <SelectItem value="DIV_L2">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-yellow-500/20 py-1 rounded-full border border-yellow-500/30 w-12">
                  <Divide className="h-3" />
                </div>
                <span>Intermediate</span>
              </div>
            </SelectItem>

            <SelectItem value="DIV_L3">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-yellow-500/20 py-1 rounded-full border border-yellow-500/30 w-12">
                  <Divide className="h-3" />
                </div>
                <span>Advanced</span>
              </div>
            </SelectItem>

            <SelectItem value="DIV_L4">
              <div className='flex items-center gap-1.5'>
                <div className="flex justify-center bg-yellow-500/20 py-1 rounded-full border border-yellow-500/30 w-12">
                  <Divide className="h-3" />
                </div>
                <span>Pro</span>
              </div>
            </SelectItem>

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
