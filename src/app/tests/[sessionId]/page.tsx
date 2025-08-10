'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useGetTestStatusQuery,
  useSaveAnswerMutation,
  useSubmitTestMutation
} from '@/store/testsSlice';
import CountdownTimer from '@/components/Tests/CountdownTimer';

export default function TestSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading } = useGetTestStatusQuery(sessionId, { pollingInterval: 5000 });
  const [saveAnswer] = useSaveAnswerMutation();
  const [submitTest] = useSubmitTestMutation();
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  const handleAnswerChange = (qId: number, value: string) => {
    setAnswers({ ...answers, [qId]: value });
    saveAnswer({ sessionId, answer: { questionId: qId, value } });
  };

  const handleSubmit = async () => {
    await submitTest(sessionId).unwrap();
    router.push('/tests/history');
  };

  // console.log({data});
  

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Session</h1>
      {/* <p>Time Remaining: {data?.data?.endTime}s</p> */}
      <CountdownTimer endTime={data?.data?.endTime || 0} />

      {data?.data?.questions?.map((q: any, i: number) => (
        <div key={q.questionId.id} className="mb-4 border-b pb-2">
          <p>{i + 1}. {q.questionId.questionText}</p>
          {q?.questionId?.options.map((opt: string, idx: number) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Submit Test
      </button>
    </div>
  );
}
