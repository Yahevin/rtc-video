// eslint-disable-next-line max-classes-per-file
import { Client } from '../types';
import { Players } from '../types/parts/players';
import { UserController } from './UserController';

export class SocketController {
  private user_id: string | null;

  private readonly players: Players;

  private readonly client: Client;

  private readonly app: any;

  constructor(app: any, ws: Client, players: Players) {
    this.app = app;
    this.client = ws;
    this.players = players;

    this.user_id = null;
  }

  async reduce(message: any) {
    // eslint-disable-next-line default-case
    switch (message.type) {
      case 'setId': {
        const id = message.payload;
        this.user_id = id;
        this.players.set(id, new UserController(id, this.client));
        break;
      }
      case 'makeOffer': {
        const address = this.players.get(message.payload.id_to);

        if (!address) {
          return console.log('crash');
        }

        // @ts-ignore
        address.makeCall({
          offer: message.payload.offer,
          id_from: this.user_id,
        });
        break;
      }
      case 'answer': {
        const address = this.players.get(message.payload.id_to);

        if (!address) return;

        // @ts-ignore
        address.makeAnswer({
          answer: message.payload.answer,
          id_from: this.user_id,
        });
        break;
      }
      case 'setIce': {
        const address = this.players.get(message.payload.id_to);
        if (!address) return;

        // @ts-ignore
        address.setIce({
          candidate: message.payload.candidate,
          id_from: this.user_id,
        });
        break;
      }
    }
  }

  async terminate() {
    // if (this.room_id !== null) {
    try {
      // await this.current_party?.playerLeave(this.player_id as number);
    } catch (error) {
      console.log(error);
    }
    // }
  }

  extract() {
    return {
      app: this.app,
      user_id: this.user_id as string,
    };
  }
}
