import { Ctrl } from '@/web-socket/ctrl';

const url = navigator.appVersion.includes('Safari') ? 'ws://172.20.10.3:8000' : 'ws://localhost:8000';

const socket = new WebSocket(url);

socket.onopen = () => {
  console.log('[open] Соединение установлено');
};

socket.onmessage = async function (event) {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'call': {
      return await Ctrl.acceptOffer(message.payload.offer, message.payload.id_from);
    }

    case 'answer': {
      return await Ctrl.acceptAnswer(message.payload.answer);
    }

    case 'setIce': {
      return await Ctrl.acceptIce(message.payload.candidate);
    }

    default: {
      console.log(`[message] Данные получены с сервера: ${event.data}`);
    }
  }
};

socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
  } else {
    console.log('[close] Соединение прервано');
  }
};

socket.onerror = (error) => {
  console.log(error);
};

export default socket;
