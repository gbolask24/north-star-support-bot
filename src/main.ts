import './style.css';
import { initChat } from './ui/chat';
import { initStore } from './store/store';

const chat = initChat();
initStore(chat);
