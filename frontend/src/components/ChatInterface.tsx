import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button-variants";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, Copy, MessageSquare, Sparkles, Heart, Flame, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";
import { getAuthToken } from "@/services/auth.service";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; type: string } | null>(null);
  const [style, setStyle] = useState("Confident"); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // <-- for auto-scroll
  const { toast } = useToast();

  const styleMap: Record<string, string> = {
    Confident: "confident",
    Flirty: "flirty",
    Funny: "funny",
    Chill: "smooth",
  };

  const rizzStyles = [
    { name: "Confident", icon: Sparkles, color: "from-purple-500 to-pink-500" },
    { name: "Flirty", icon: Heart, color: "from-rose-500 to-red-500" },
    { name: "Funny", icon: Flame, color: "from-orange-500 to-yellow-500" },
    { name: "Chill", icon: Zap, color: "from-blue-500 to-cyan-500" },
  ];

  /** Scroll to bottom whenever messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Load chat history */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getAuthToken();
        const resp = await fetch(`${API_URL}/chat/history?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();

        if (data.success && Array.isArray(data.messages)) {
          const formatted: Message[] = [];

          data.messages.forEach((msg: any) => {
            if (msg.content) {
              formatted.push({ id: msg.id + "-user", type: "user", content: msg.content, timestamp: msg.timestamp });
            }
            if (msg.response) {
              formatted.push({ id: msg.id + "-ai", type: "ai", content: msg.response, timestamp: msg.timestamp });
            }
          });

          formatted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(formatted);
        }
      } catch (err: any) {
        console.error("Failed to load chat history:", err);
        toast({ title: "Error", description: "Could not load chat history", variant: "destructive" });
      }
    };
    fetchHistory();
  }, []);

  /** Send message */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !imageData) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      type: "user",
      content: `[${style}] ${inputMessage}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        toast({ title: "Not authenticated", description: "Please sign in", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const payload: any = { 
        message: inputMessage, 
        style: styleMap[style] || "confident",
        ...(imageData?.base64 && { imageBase64: imageData.base64, imageType: imageData.type }) 
      };

      const resp = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: "Error", description: data.message || "Failed to send message", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        type: "ai",
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e: any) {
      console.error("Send message error:", e);
      toast({ title: "Error", description: e.message || "Unexpected error", variant: "destructive" });
    } finally {
      setInputMessage("");
      setImageData(null);
      setImagePreview(null);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Response copied to clipboard" });
  };

  const onUploadClick = () => fileInputRef.current?.click();
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast({ title: "Invalid file", description: "Please upload an image", variant: "destructive" });
      return;
    }
    const base64 = await toBase64(file);
    setImageData({ base64, type: file.type });
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col w-full h-[90vh] px-4 py-6 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #4B0082, #1A0A26)' }}>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#391C5F]/80 to-[#0e121a]/90"></div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 relative z-10 pr-4"> {/* <-- added padding right */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-white/70">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Start a new conversation</h3>
            <p>Type a message or upload an image to begin.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`${msg.type === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground'} p-3 rounded-xl max-w-[75%]`}>
                <p className="text-sm">{msg.content}</p>
                {msg.type === 'ai' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white" onClick={() => copyToClipboard(msg.content)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div> {/* <-- auto-scroll target */}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-xl animate-bounce-gentle">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2 relative z-10 bg-[#0e1527] p-4 rounded-xl">
        <Textarea
          placeholder={`Message in ${style} style...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="min-h-[80px] bg-[#1b2033] border border-border/50 resize-none rounded-xl p-3 text-white placeholder-white/70"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Button variant="ghost" size="sm" className="text-white/70" onClick={onUploadClick}>
              <Image className="w-4 h-4 mr-2" /> {imagePreview ? "Change Image" : "Upload Image"}
            </Button>
            {imagePreview && <img src={imagePreview} alt="preview" className="h-10 w-10 rounded object-cover border border-border/40" />}
          </div>

          <Button variant="hero" size="sm" onClick={handleSendMessage} disabled={(!inputMessage.trim() && !imageData) || isLoading}>
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </div>

        {/* Rizz Style Buttons */}
        <div className="flex gap-2 mt-2">
          {rizzStyles.map((s) => {
            const Icon = s.icon;
            const isActive = style === s.name;
            return (
              <button
                key={s.name}
                onClick={() => setStyle(s.name)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition
                  ${isActive ? `bg-gradient-to-r ${s.color} text-white shadow` : "bg-muted text-foreground hover:bg-muted/70"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {s.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
