import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

export function ViewAllQuestionsDialog({
  questions,
  currentQuestionIndex,
  handleQuestionNavigate,
  isAnswered,
  answers,
  handleSubmit,
  allQuestionsAnswered,
}: any) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>View All</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 data-[state=open]:animate-overlayShow z-50 bg-[#161821]" />
        <Dialog.Content className="bg-[#1f2635] text-white fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow z-51">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            All Questions
          </Dialog.Title>
          <ViewAllQuestionsDialogContent
            questions={questions}
            handleQuestionNavigate={handleQuestionNavigate}
            currentQuestionIndex={currentQuestionIndex}
            isAnswered={isAnswered}
            answers={answers}
            handleSubmit={handleSubmit}
            allQuestionsAnswered={allQuestionsAnswered}
          />
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const ViewAllQuestionsDialogContent = ({
  questions,
  currentQuestionIndex,
  handleQuestionNavigate,
  isAnswered,
  answers,
  handleSubmit,
  allQuestionsAnswered,
}: any) => {
  return (
    <div>
      <div>
        <div className="text-gray-400">Navigate between questions and track your progress</div>
      </div>

      <div className="grid grid-cols-5 gap-3 my-6">
        {questions.map((q: any, index: any) => (
          <Dialog.Close asChild key={index}>
            <button
              key={q.id}
              onClick={() => handleQuestionNavigate(index)}
              className={`aspect-square rounded-full flex items-center justify-center text-lg transition-all border-2 ${
                index === currentQuestionIndex
                  ? 'bg-purple-500 border-purple-400 text-white scale-110'
                  : isAnswered(q.id)
                    ? 'bg-green-500 border-green-400 text-white hover:scale-105'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          </Dialog.Close>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-300">
            Answered ({Object.keys(answers).filter(key => answers[parseInt(key)] !== '').length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-700"></div>
          <span className="text-gray-300">
            Unanswered (
            {questions.length -
              Object.keys(answers).filter(key => answers[parseInt(key)] !== '').length}
            )
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allQuestionsAnswered}
        className={`mb-4 w-full py-4 rounded-2xl transition-all ${
          allQuestionsAnswered
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {allQuestionsAnswered
          ? 'Submit All Answers'
          : `Answer all questions to submit (${Object.keys(answers).filter(key => answers[parseInt(key)] !== '').length}/${questions.length})`}
      </button>

      <Dialog.Close asChild>
        <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
          Continue Practice
        </button>
      </Dialog.Close>
    </div>
  );
};
