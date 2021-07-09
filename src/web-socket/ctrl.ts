import SocketAction from '@/web-socket/action';

const config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

class Control {
  private stream: MediaStream;

  private partner_id: string;

  private connection: RTCPeerConnection;

  private localVideo: HTMLVideoElement;

  private remoteVideo: HTMLVideoElement;

  constructor() {
    this.connection = new RTCPeerConnection(config);
    this.partner_id = undefined as unknown as string;
    this.stream = undefined as unknown as MediaStream;
    this.localVideo = undefined as unknown as HTMLVideoElement;
    this.remoteVideo = undefined as unknown as HTMLVideoElement;

    this.connection.onicecandidate = this.handleICECandidateEvent.bind(this);
    this.connection.ontrack = this.handleTrackEvent.bind(this);
    // this.connection.onnegotiationneeded = this.handleNegotiationNeededEvent;
    // this.connection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    // this.connection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    // this.connection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
  }

  async getStream() {
    this.stream = await navigator.mediaDevices?.getUserMedia({
      video: { facingMode: 'user' },
      audio: true,
    });

    this.stream.getTracks().forEach((track) => this.connection.addTrack(track, this.stream));

    return this.stream;
  }

  async setLocalStream(node: HTMLVideoElement) {
    this.localVideo = node;

    // eslint-disable-next-line no-param-reassign
    node.srcObject = await this.getStream();
  }

  async setRemoteStream(node: HTMLVideoElement) {
    this.remoteVideo = node;
    console.log(node);
  }

  async createOffer(id: string) {
    this.partner_id = id;

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    SocketAction.makeOffer({
      offer,
      id_to: id,
    });
  }

  async acceptOffer(offer: RTCSessionDescription, id_from: string) {
    this.partner_id = id_from;

    await this.connection.setRemoteDescription(offer);

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    SocketAction.answer({
      answer,
      id_to: id_from,
    });
  }

  async acceptIce(msg: RTCIceCandidate) {
    const candidate = new RTCIceCandidate(msg);

    await this.connection.addIceCandidate(candidate);
  }

  async acceptAnswer(answer: RTCSessionDescription) {
    await this.connection.setRemoteDescription(answer);
  }

  handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      SocketAction.setIce({
        candidate: event.candidate,
        id_to: this.partner_id,
      });
    }
  }

  handleTrackEvent(event: RTCTrackEvent) {
    this.remoteVideo.srcObject = event.streams[0];
  }
}

export const Ctrl = new Control();
