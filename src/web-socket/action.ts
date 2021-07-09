import socket from '@/web-socket/index';

const SocketAction = {
  setId(id: string): void {
    socket.send(
      JSON.stringify({
        type: 'setId',
        payload: id,
      }),
    );
  },
  makeOffer({ offer, id_to }): void {
    socket.send(
      JSON.stringify({
        type: 'makeOffer',
        payload: { offer, id_to },
      }),
    );
  },
  answer({ answer, id_to }): void {
    socket.send(
      JSON.stringify({
        type: 'answer',
        payload: { answer, id_to },
      }),
    );
  },
  setIce({ candidate, id_to }): void {
    socket.send(
      JSON.stringify({
        type: 'setIce',
        payload: { candidate, id_to },
      }),
    );
  },
};

export default SocketAction;
