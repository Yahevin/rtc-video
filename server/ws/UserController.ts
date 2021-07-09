import { Client } from '../types';

export class UserController {
  private readonly user_id: number;

  private readonly client: Client;

  constructor(user_id: number, client: Client) {
    this.user_id = user_id;
    this.client = client;
  }

  // @ts-ignore
  makeCall({ offer, id_from }) {
    this.client.send(
      JSON.stringify({
        type: 'call',
        payload: {
          offer,
          id_from,
        },
      }),
    );
  }

  // @ts-ignore
  makeAnswer({ answer, id_from }) {
    this.client.send(
      JSON.stringify({
        type: 'answer',
        payload: {
          answer,
          id_from,
        },
      }),
    );
  }

  // @ts-ignore
  setIce({ candidate, id_from }) {
    this.client.send(
      JSON.stringify({
        type: 'setIce',
        payload: {
          candidate,
          id_from,
        },
      }),
    );
  }
}
