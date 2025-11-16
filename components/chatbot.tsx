"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

const quickQuestions = [
  "What is Cyberix?",
  "How do I install Cyberix?",
  "What security tools does Cyberix use?",
  "How does WSL integration work?",
  "What types of scans can I perform?",
  "How do I generate reports?",
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Cyberix AI assistant. I can help you with questions about Cyberix features, installation, usage, and troubleshooting. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Prepare conversation history (excluding system message)
      const conversationHistory = messages
        .filter(msg => msg.id !== 1) // Exclude initial greeting
        .map(msg => ({
          sender: msg.sender,
          text: msg.text
        }))

      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: conversationHistory
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Failed to get response')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.data?.response || data.response || "I apologize, but I couldn't generate a response. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error. Please try again later or check your connection.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-5 z-50 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center group"
          style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            fontWeight: '600',
            bottom: '20px' // Position at bottom, below go-to-top button
          }}
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed right-8 z-50 w-96 h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20 rounded-lg flex flex-col overflow-hidden backdrop-blur-sm"
          style={{ 
            bottom: '20px' // Position at bottom, below go-to-top button
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between border-b border-orange-400/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Cyberix AI Assistant
                </h3>
                <p className="text-orange-100 text-xs" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  {isLoading ? 'Thinking...' : 'Online • Ready to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-950/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600"
                      : "bg-gradient-to-r from-gray-700 to-gray-800 border border-orange-500/30"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-orange-400" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "bg-gray-800/80 border border-white/10 text-gray-100"
                  }`}
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  {message.sender === "ai" && isLoading && message.id === messages.length ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.sender === "user" && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-gray-700 to-gray-800 border border-orange-500/30">
                  <Bot className="w-4 h-4 text-orange-400" />
                </div>
                <div className="max-w-[75%] rounded-lg px-4 py-2.5 bg-gray-800/80 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                    <p className="text-sm text-gray-300">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-white/10 bg-gray-900/50">
              <p className="text-xs text-gray-400 mb-2 px-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 text-gray-300 hover:text-orange-400 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-gray-900/80">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask about Cyberix..."
                disabled={isLoading}
                className="flex-1 bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

