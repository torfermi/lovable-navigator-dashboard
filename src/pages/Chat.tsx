import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send24Regular,
  Bot24Regular,
  Person24Regular,
  Mic24Regular,
  Stop24Regular,
  History24Regular,
  Add24Regular,
} from '@fluentui/react-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy el asistente de IngenieríaCopilot. Estoy aquí para ayudarte con consultas de ingeniería, cálculos, documentación técnica y más. ¿En qué puedo asistirte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular respuesta del asistente
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Entiendo tu consulta sobre "${userMessage.content}". Como asistente de ingeniería, puedo ayudarte con:

• Cálculos estructurales y de resistencia de materiales
• Diseño de sistemas mecánicos y eléctricos
• Interpretación de normas técnicas
• Análisis de especificaciones técnicas
• Recomendaciones de materiales y componentes

¿Podrías proporcionarme más detalles específicos sobre lo que necesitas?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Aquí se implementaría la funcionalidad de grabación de voz
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const suggestedQuestions = [
    "¿Cómo calculo la resistencia de una viga de acero?",
    "¿Qué normativas aplican para instalaciones eléctricas?",
    "¿Cuál es la diferencia entre soldadura MIG y TIG?",
    "¿Cómo dimensiono un sistema de ventilación?",
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat de Ingeniería</h1>
          <p className="text-muted-foreground mt-2">
            Conversa con el asistente especializado en ingeniería
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <History24Regular className="w-4 h-4 mr-2" />
            Historial
          </Button>
          <Button variant="outline" size="sm">
            <Add24Regular className="w-4 h-4 mr-2" />
            Nueva conversación
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center space-x-2">
                <Bot24Regular className="w-5 h-5 text-engineering-blue" />
                <CardTitle>Asistente de Ingeniería</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  En línea
                </Badge>
              </div>
              <CardDescription>
                Especializado en consultas técnicas y de ingeniería
              </CardDescription>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-engineering-light text-engineering-blue'
                        }`}>
                          {message.role === 'user' ? (
                            <Person24Regular className="w-4 h-4" />
                          ) : (
                            <Bot24Regular className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-2 ${
                            message.role === 'user' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex space-x-2 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-engineering-light text-engineering-blue flex items-center justify-center">
                          <Bot24Regular className="w-4 h-4" />
                        </div>
                        <div className="bg-muted text-foreground rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-engineering-blue rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-engineering-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-engineering-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu consulta de ingeniería aquí..."
                    className="min-h-[50px] max-h-[150px] pr-12 resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 p-1"
                    onClick={toggleRecording}
                    disabled={isLoading}
                  >
                    {isRecording ? (
                      <Stop24Regular className="w-4 h-4 text-destructive" />
                    ) : (
                      <Mic24Regular className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="self-end"
                >
                  <Send24Regular className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with suggestions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preguntas Sugeridas</CardTitle>
              <CardDescription>
                Consultas comunes de ingeniería
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left h-auto p-3 whitespace-normal justify-start"
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capacidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Cálculos estructurales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Análisis de materiales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Normativas técnicas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Diseño mecánico</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Integración Microsoft Graph</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Webhooks n8n</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};