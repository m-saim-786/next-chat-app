import React from 'react'

import { cn } from '@/lib/utils'

type TypingAnimationProps = {
  className?: string;
  animationDuration?: string;
}

const TypingAnimation = ({ className, animationDuration = '1.5s'}: TypingAnimationProps) => {
  // Calculate animation delays based on animationDuration prop
  const delay1 = `${parseInt(animationDuration) * 0.2}s`
  const delay2 = `${parseInt(animationDuration) * 0.3}s`
  const delay3 = `${parseInt(animationDuration) * 0.4}s`

  return (
    <div className="flex items-center h-3">
      <style>
        {`
          @keyframes mercuryTypingAnimation {
            0% {
              transform: translateY(0px);
            }
            28% {
              transform: translateY(-5px);
            }
            44% {
              transform: translateY(0px);
            }
          }

          .animate-typing1 {
            animation: mercuryTypingAnimation ${animationDuration} infinite ease-in-out;
            animation-delay: ${delay1};
          }

          .animate-typing2 {
            animation: mercuryTypingAnimation ${animationDuration} infinite ease-in-out;
            animation-delay: ${delay2};
          }

          .animate-typing3 {
            animation: mercuryTypingAnimation ${animationDuration} infinite ease-in-out;
            animation-delay: ${delay3};
          }
        `}
      </style>
      <div className="flex items-center space-x-0.5">
        <div className={cn('bg-black rounded-sm w-1 h-1 animate-typing1', className)}></div>
        <div className={cn('bg-black rounded-sm w-1 h-1 animate-typing2', className)}></div>
        <div className={cn('bg-black rounded-sm w-1 h-1 animate-typing3', className)}></div>
      </div>
    </div>
  )
}

export default TypingAnimation


