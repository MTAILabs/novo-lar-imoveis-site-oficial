import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  UserRound,
  WifiOff,
  X,
} from 'lucide-react';
import './index.css';


// const WEBHOOK_URL = 'https://automacaon8n03.app.n8n.cloud/webhook/sac-novo-lar'; 

const WEBHOOK_URL = 'https://n8n.mtailabs.tech/webhook/sac-novo-lar';

type Message = { id: string; sender: 'carol' | 'user'; text: string };
type WebhookResponse = { reply?: string; encerrar?: boolean };

const createSessionId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `sessao-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const initialMessage: Message = {
  id: 'welcome',
  sender: 'carol',
  text: 'Oi! Eu sou a Carol, a Agente de Inteligência Artificial da Novo Lar. Posso ajudar você a encontrar um imóvel ou tirar suas dúvidas sobre Maricá.',
};

const regions = ['Centro', 'Itaipuaçu', 'Ponta Negra', 'Inoã'];

function App() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const sessionId = useMemo(createSessionId, []);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending, requestError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isSending || isClosed) return;

    setMessages((current) => [...current, { id: `${Date.now()}-user`, sender: 'user', text: message }]);
    setInput('');
    setRequestError(false);
    setIsSending(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });
      if (!response.ok) throw new Error('Falha ao responder');
      const data: WebhookResponse = await response.json();
      if (!data.reply) throw new Error('Resposta inválida');
      setMessages((current) => [...current, { id: `${Date.now()}-carol`, sender: 'carol', text: data.reply as string }]);
      if (data.encerrar === true) setIsClosed(true);
    } catch {
      setRequestError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand brand-compact" href="#inicio" aria-label="Novo Lar Imóveis - início"><img src="/logo-header-transparent.png" alt="Novo Lar Imóveis" /></a>
        <span className="beta-tag">Versão Beta 4.0 (OpenAI Model Mini 4.0 — n8n Self Hosted in Gostinger - Atualizado em 07/09/2026</span>
        <div className="header-contact"><span>Fale com a gente</span><a href="https://wa.me/5521999990000" target="_blank" rel="noreferrer"><Phone size={16} /> (21) 99999-0000</a></div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span /> MARICÁ, RJ <span /></div>
              <img className="brand-hero" src="/logo-hero-transparent.png" alt="Novo Lar Imóveis — Seu novo começo, nosso compromisso" />
              <h1>Seu próximo endereço começa com uma conversa.</h1>
              <p>Encontre apartamentos, casas e salas comerciais em Maricá com quem entende do lugar — e do que faz um imóvel virar lar.</p>
              <a className="hero-link" href="#atendimento">Conversar com a Carol <ArrowUpRight size={17} /></a>
            </div>
            <div className="hero-side-note"><span className="vertical-line" /><p>Do primeiro “oi”<br />à chave na mão.</p></div>
          </div>
          <div className="scroll-hint"><span /> role para conhecer</div>
        </section>

        <section className="quick-facts" aria-label="Informações sobre os imóveis">
          <div className="fact-block fact-regions"><span className="fact-label">Onde estamos</span><div className="region-list">{regions.map((region) => <span key={region}><MapPin size={13} /> {region}</span>)}</div></div>
          <div className="fact-block"><span className="fact-label">Venda</span><strong>R$ 180 mil <i>—</i> R$ 1,5 mi</strong></div>
          <div className="fact-block"><span className="fact-label">Aluguel</span><strong>R$ 800 <i>—</i> R$ 6 mil/mês</strong></div>
        </section>

        <section className="chat-section" id="atendimento">
          <div className="section-intro"><span className="kicker"><Sparkles size={15} /> Atendimento personalizado</span><h2>Vamos encontrar<br /><em>o seu lugar?</em></h2><p>Conte para a Carol o que você procura. Ela está aqui para orientar cada passo, sem pressa e sem complicação.</p><div className="intro-detail"><span /> Atendimento humano, do seu jeito</div></div>
          <div className="chat-card">
            <div className="chat-topbar"><div className="carol-profile"><div className="avatar"><UserRound size={22} /></div><div><strong>Carol</strong><span><b /> Assistente Novo Lar</span></div></div><button className="more-button" aria-label="Fechar atendimento" type="button"><X size={18} /></button></div>
            <div className="chat-date">HOJE, ATENDIMENTO ONLINE</div>
            <div className="message-list" ref={messageListRef} aria-live="polite">
              {messages.map((message, index) => <div className={`message-row ${message.sender}-row`} key={message.id}>{message.sender === 'carol' && <div className="mini-avatar"><UserRound size={15} /></div>}<div className={`message-bubble ${message.sender}-bubble`}>{index === 0 && <span className="message-name">Carol</span>}{message.text}<time>Agora</time></div></div>)}
              {isSending && <div className="typing-row"><div className="mini-avatar"><UserRound size={15} /></div><div className="typing"><i /><i /><i /></div><span>Carol está digitando</span></div>}
              {requestError && <div className="error-note"><WifiOff size={15} /><span>Não consegui responder agora. Tente novamente ou fale pelo <a href="https://wa.me/5521999990000" target="_blank" rel="noreferrer">WhatsApp</a>.</span></div>}
              {isClosed && <div className="closed-note">Atendimento encerrado. Obrigada por conversar com a Novo Lar.</div>}
            </div>
            <form className="chat-form" onSubmit={handleSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={isClosed ? 'Conversa encerrada' : 'Escreva sua mensagem...'} disabled={isSending || isClosed} aria-label="Sua mensagem" /><button type="submit" aria-label="Enviar mensagem" disabled={isSending || isClosed || !input.trim()}><Send size={18} /></button></form>
            <div className="chat-footer"><span><MessageCircle size={13} /> Suas mensagens são privadas</span><span>Powered by Novo Lar</span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><img className="brand-footer" src="/logo-footer-transparent.png" alt="Novo Lar Imóveis" /><p>Seu novo começo, nosso compromisso.</p></div><div className="footer-hours"><span className="fact-label">Horário de atendimento</span><strong><Clock3 size={16} /> Seg. a sex. 9h–18h<br /><small>Sáb. 9h–13h</small></strong></div><div className="footer-contact"><span className="fact-label">Fale com a gente</span><a href="https://wa.me/5521999990000">(21) 99999-0000 <ArrowUpRight size={15} /></a><a className="instagram" href="#inicio"><Instagram size={16} /> @novolarimoveis</a></div><div className="footer-bottom"><span>© 2024 Novo Lar Imóveis</span><span>Maricá, Rio de Janeiro</span></div></footer>
    </div>
  );
}

export default App;
