import { formatAmount } from 'lib/utils/helper';
import React from 'react';

const TEMPLATE_WIDTH = 700;
const TEMPLATE_HEIGHT = 300;

const xPct = (x: number) => (x / TEMPLATE_WIDTH) * 100;
const yPct = (y: number) => (y / TEMPLATE_HEIGHT) * 100;

export interface ChequeProps {
  templateSrc: string;
  bankName: string;
  date: string;
  payeeName: string;
  amountInWords: string | [string, string?];
  amount: string;
  className?: string;
}

function splitAmountInWords(text: string): [string, string] {
  const maxLineOneChars = 50;
  const words = text.trim().split(/\s+/);
  let line1 = '';
  let i = 0;
  for (; i < words.length; i++) {
    const next = line1 ? `${line1} ${words[i]}` : words[i];
    if (next.length > maxLineOneChars && line1) break;
    line1 = next;
  }
  const line2 = words.slice(i).join(' ');
  return [line1, line2];
}

const PDCCheque: React.FC<ChequeProps> = ({
  templateSrc,
  bankName,
  date,
  payeeName,
  amountInWords,
  amount,
  className = '',
}) => {
  const [wordsLine1, wordsLine2] = Array.isArray(amountInWords)
    ? [amountInWords[0], amountInWords[1] ?? '']
    : splitAmountInWords(amountInWords);

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        className="
          relative
          w-[min(92vw,700px)] aspect-[700/300]
        "
      >
        <div
          className="
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[min(84vw,700px)] aspect-[700/300]
          "
        >
          <img
            src={templateSrc}
            alt="Blank cheque template"
            className="absolute inset-0 h-full w-full select-none pointer-events-none"
            draggable={false}
          />

          {/* Bank name */}
          <div
            className="absolute font-regular text-slate-800 leading-none whitespace-nowrap"
            style={{
              left: `${xPct(20)}%`,
              top: `${yPct(20)}%`,
              fontSize: 'clamp(7px, 2.2vw, 15px)',
            }}
          >
            {bankName}
          </div>

          {/* Date */}
          <div
            className="absolute font-regular text-slate-800 leading-none text-right whitespace-nowrap"
            style={{
              left: `${xPct(535)}%`,
              top: `${yPct(30)}%`,
              width: `${xPct(678.7 - 560)}%`,
              fontSize: 'clamp(7px, 2vw, 14px)',
            }}
          >
            {date}
          </div>

          {/* Payee name */}
          <div
            className="absolute font-normal text-slate-800 leading-none truncate"
            style={{
              left: `${xPct(50)}%`,
              top: `${yPct(85)}%`,
              width: `${xPct(670 - 170)}%`,
              fontSize: 'clamp(7px, 2vw, 14px)',
            }}
          >
            {payeeName}
          </div>

          {/* Amount in words - line 1 */}
          <div
            className="absolute font-normal text-slate-800 leading-none truncate first-letter:uppercase"
            style={{
              left: `${xPct(70)}%`,
              top: `${yPct(142)}%`,
              width: `${xPct(465 - 95)}%`,
              fontSize: 'clamp(7px, 2vw, 14px)',
            }}
          >
            {wordsLine1}
          </div>

          {/* Amount in words - line 2 */}
          {wordsLine2 && (
            <div
              className="absolute font-normal text-slate-800 leading-none truncate"
              style={{
                left: `${xPct(-30)}%`,
                top: `${yPct(192)}%`,
                width: `${xPct(465 - 95)}%`,
                fontSize: 'clamp(7px, 2vw, 14px)',
              }}
            >
              {wordsLine2}
            </div>
          )}

          <div
            className="absolute flex items-baseline gap-2"
            style={{
              left: `${xPct(480)}%`,
              top: `${yPct(176)}%`,
              width: `${xPct(665 - 500)}%`,
            }}
          >
            <span
              className="min-w-0 flex-1 font-medium text-slate-900 leading-none truncate"
              style={{ fontSize: 'clamp(8px, 2.2vw, 24px)' }}
            >
              {formatAmount(amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDCCheque;
