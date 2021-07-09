/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import SocketAction from '@/web-socket/action';
import { Ctrl } from '@/web-socket/ctrl';

export const IndexPage = () => {
  const localVideo = async (node: HTMLVideoElement | null) => {
    if (!node) return;

    await Ctrl.setLocalStream(node);
  };
  const remoteVideo = async (node: HTMLVideoElement | null) => {
    if (!node) return;

    await Ctrl.setRemoteStream(node);
  };

  const [visibility, setVisibility] = useState(false);

  const inputTo = useRef();

  const callTo = async () => {
    // @ts-ignore
    const id = inputTo?.current?.value;

    await Ctrl.createOffer(id);
  };

  const inputFrom = useRef();

  const saveName = () => {
    // @ts-ignore
    const name = inputFrom?.current?.value;
    setVisibility(true);

    SocketAction.setId(name);
  };

  return (
    <div>
      {visibility ? (
        <>
          <div>
            <video ref={localVideo} autoPlay muted />
            <video ref={remoteVideo} autoPlay />
          </div>
          <div>
            <input type="text" ref={inputTo} placeholder="call to" />
            <span onClick={callTo}>ok</span>
          </div>
        </>
      ) : (
        <>
          <input type="text" ref={inputFrom} placeholder="my name" />
          <span onClick={saveName}>ok</span>
        </>
      )}
    </div>
  );
};
