"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

const aiResponses = [
  "Hello! I'm here to help you with any questions about our cybersecurity services. How can I assist you today?",
  "Great question! Our AI-powered platform provides real-time vulnerability detection, phishing protection, and comprehensive security monitoring. Would you like to know more about any specific feature?",
  "We offer multiple plans to suit different needs - from individual websites to enterprise solutions. All plans include our advanced AI threat detection and instant PDF reports.",
  "Absolutely! You can start with a free trial that includes scanning your first 2 websites at no cost. No credit card required.",
  "Our platform uses advanced machine learning algorithms trained on the latest threat intelligence to achieve 98% accuracy in vulnerability detection.",
  "Yes, we provide REST API access and support integrations with popular security platforms, SIEM tools, and development workflows.",
  "Our comprehensive scans typically complete in 5-15 minutes for websites, and 30-60 minutes for full infrastructure assessments. You can monitor progress in real-time.",
  "Thank you for your interest! You can start your free trial by clicking the 'Start Free Security Scan' button on our homepage, or contact our support team for more information.",
]

const quickQuestions = [
  "What services do you offer?",
  "How much does it cost?",
  "Is there a free trial?",
  "How accurate is the detection?",
  "Can I integrate with other tools?",
  "How long does a scan take?",
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with our cybersecurity services today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
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

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI thinking delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const aiMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 800)
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
                  Online • Ready to help
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
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
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
                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 text-gray-300 hover:text-orange-400 rounded-full transition-all duration-200"
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
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

