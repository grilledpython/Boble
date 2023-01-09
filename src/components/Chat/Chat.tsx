import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMessages, messagesListener } from '../../hooks/useMessages'

import LoadSpinner from '../../layout/LoadSpinner/LoadSpinner'
import ChatMessage from '../ChatMessage/ChatMessage'
import ChatInput from '../ChatInput/ChatInput'

interface Props {
  channelId: string
}

export default function Chat({ channelId }: Props) {
  const chatRef = useRef<HTMLUListElement>(null)

  const {
    data: messages,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['chat', channelId],
    queryFn: async () => await getMessages({ channelId }),
    retry: false,
    enabled: !!channelId
  })

  const chatError = error as Error

  useEffect(() => {
    // Subscribe to realtime messages updates
    messagesListener({
      channelId,
      callback: refetch
    })
  }, [channelId])

  useEffect(() => {
    // Scroll to bottom of chat
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  })

  if (!channelId) {
    return (
      <div className="h-full px-4 bg-zinc-100 dark:bg-zinc-800">
        <p className="pt-12 text-lg font-semibold text-center">
          Select a channel to start chatting
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col mt-10 md:mt-20 bg-zinc-100 dark:bg-zinc-800">
        <LoadSpinner />
        <ChatInput channelId={channelId} />
      </div>
    )
  }

  if (chatError?.message) {
    return (
      <div className="px-8 py-8 bg-zinc-100">
        <p className="p-1.5 pl-3 mt-5 bg-red-100 border-l-4 border-red-600 dark:bg-zinc-800">
          {chatError.message}
        </p>
      </div>
    )
  }

  if (!messages?.length) {
    return (
      <div className="flex flex-col h-full border-red-500 bg-zinc-100 dark:bg-zinc-800">
        <div className="flex-grow px-4">
          <p className="pt-10 my-5 text-xl font-bold text-center">
            No messages yet
          </p>
          <p className="text-center">
            Start the conversation to see your messages here.
          </p>
        </div>
        <ChatInput channelId={channelId} />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full bg-zinc-100 dark:bg-zinc-800">
      <ul
        ref={chatRef}
        className="z-10 flex-col flex-grow px-4 pb-20 overflow-y-auto scroll-smooth">
        {messages.map((m) => (
          <li key={m.id}>
            <ChatMessage message={m} />
          </li>
        ))}
      </ul>
      <ChatInput channelId={channelId} />
    </div>
  )
}
