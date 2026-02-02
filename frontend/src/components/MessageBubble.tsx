/**
 * Message Bubble Component
 * Displays individual chat messages with citations
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Message as ChatMessage, Citation } from '@/lib/api';
import { CyberBrainIcon } from './CyberBrainIcon';

interface MessageBubbleProps {
    message: ChatMessage;
    isLatest?: boolean; // To trigger laser effect
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const [showCitations, setShowCitations] = useState(false);
    const isUser = message.role === 'user';
    const hasCitations = message.citations && message.citations.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg
          ${isUser ? 'bg-blue-600' : 'bg-[#1e2530]'}`}
                >
                    {isUser ? '👤' : '🤖'}
                </div>

                {/* Message Content */}
                <div className="flex flex-col">
                    <div className={`px-4 py-3 ${isUser ? 'chat-bubble-user text-white' : 'chat-bubble-assistant'}`}>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                    code: ({ children }) => (
                                        <code className="bg-[#2d3748] px-1 py-0.5 rounded text-sm">{children}</code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-[#2d3748] p-3 rounded-lg overflow-x-auto my-2">{children}</pre>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Citations */}
                    {!isUser && hasCitations && (
                        <div className="mt-2">
                            <button
                                onClick={() => setShowCitations(!showCitations)}
                                className="text-sm text-[#4a90e2] hover:text-[#5ba0f2] flex items-center gap-1"
                            >
                                📌 {showCitations ? 'Hide' : 'Show'} Sources ({message.citations.length})
                            </button>

                            {showCitations && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 space-y-2"
                                >
                                    {message.citations.map((citation, idx) => (
                                        <CitationCard key={idx} citation={citation} index={idx + 1} />
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

interface CitationCardProps {
    citation: Citation;
    index: number;
}

function CitationCard({ citation, index }: CitationCardProps) {
    const [expanded, setExpanded] = useState(false);
    const content = citation.content || '';
    const previewLength = 200;
    const needsExpand = content.length > previewLength;

    return (
        <div className="citation-box text-xs bg-[#0f172a] border border-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[#22d3ee]">Source {index}</span>
                <span className="text-gray-500">({citation.metadata?.source || 'Unknown'})</span>
                {citation.metadata?.page && <span className="text-gray-500">Page {citation.metadata.page}</span>}
            </div>
            <p className="text-gray-400 leading-relaxed">
                {expanded || !needsExpand
                    ? content
                    : `${content.slice(0, previewLength)}...`}
            </p>
            {needsExpand && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-[#22d3ee] hover:underline mt-1"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}

export default MessageBubble;
