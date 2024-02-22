import debug from "debug";
import { reaction, observe } from "mobx";
import {
  RoomData,
  RoomStat,
  RoomChat,
  RoomReaction,
  RoomCast,
} from "../utils/types";
import RootStore from "../stores";
import { LocalAudioStream, LocalVideoStream } from "@skyway-sdk/room";

const log = debug("effect:room");

export const joinRoom = (store: RootStore) => {
  log("joinRoom()");
  const { room, ui, media, client, notification } = store;

  if (room.name === null || room.mode === null) {
    throw ui.showError(new Error("Room name or mode is undefined!"));
  }
  const localRoomMember = room.peer;
  if (localRoomMember === null) {
    throw ui.showError(new Error("Peer is not created!"));
  }

  // メディアをpublish/subscribeしない状態で入室済み
  room.room = localRoomMember.room;

  // publishする
  media.stream.getAudioTracks().forEach((track) => {
    const stream = new LocalAudioStream(track);
    localRoomMember.publish(stream);
  });
  media.stream.getVideoTracks().forEach((track) => {
    const stream = new LocalVideoStream(track);
    localRoomMember.publish(stream);
  });

  const confRoom = room.room;
  // must not be happened
  if (confRoom === null) {
    throw ui.showError(new Error("Room is null!"));
  }

  log("joined room", confRoom);

  // force set to false
  ui.isReEntering = false;

  const disposers = [
    reaction(
      () => ({ ...media.stat, ...client.stat }),
      (stat) => {
        log("reaction:send(stat)");
        localRoomMember.updateMetadata(
          JSON.stringify({ type: "stat", payload: stat }),
        );
      },
    ),
    reaction(
      () => room.myLastChat,
      (chat) => {
        if (chat === null) {
          return;
        }
        log("reaction:send(chat)");
        localRoomMember.updateMetadata(
          JSON.stringify({ type: "chat", payload: chat }),
        );
      },
    ),
    reaction(
      () => room.myLastReaction,
      (reaction) => {
        if (reaction === null) {
          return;
        }
        log("reaction:send(reaction)");
        localRoomMember.updateMetadata(
          JSON.stringify({ type: "reaction", payload: reaction }),
        );
      },
    ),
    reaction(
      () => room.castRequestCount,
      () => {
        log("reaction:send(cast)");
        localRoomMember.updateMetadata(
          JSON.stringify({
            type: "cast",
            payload: { from: client.displayName },
          }),
        );
      },
    ),
    observe(media, "videoDeviceId", (change) => {
      log("observe(media.videoDeviceId)");
      if (!room.isJoined) {
        log("do nothing before room join");
        return;
      }

      // camera OR display was changed, not need to re-enter
      if (change.oldValue !== null && change.newValue !== null) {
        log("just change video by replaceStream(), no need to re-enter");
        confRoom.replaceStream(media.stream);
        return;
      }

      // camera OR display was enabled, need to re-enter
      // camera OR display was disabled, need to re-enter
      log("need to re-enter the room to add/remove video");
      if (room.room === null) {
        throw ui.showError(new Error("Room is null!"));
      }
      // force close the room, triggers re-entering
      ui.isReEntering = true;
      room.room.close();
      notification.showInfo("Re-enter the room to add/remove video");
    }),
  ];

  // auto subscribe設定
  confRoom.onStreamPublished.add(({ publication }) => {
    if (publication.publisher.id === localRoomMember.id) return;

    log("onStreamPublished", publication);
    localRoomMember.subscribe(publication);
  });

  // Subscribed時の対応
  // - confRoom.onPublicationSubscribedでは、subscription.streamはundefined
  localRoomMember.onPublicationSubscribed.add(({ subscription }) => {
    if (subscription.subscriber.id !== localRoomMember.id) return;

    log("onPublicationSubscribed", subscription);

    const remoteStream = subscription.stream;
    if (remoteStream === undefined) return;

    const publisherId = subscription.publication.publisher.id;
    if (remoteStream.contentType === "audio") {
      room.remoteAudioStreams.set(publisherId, remoteStream);

      const remoteVideoStream = room.remoteVideoStreams.get(publisherId);
      const mediaStream = new MediaStream(
        remoteVideoStream === undefined ? [] : [remoteVideoStream.track],
      );
      mediaStream.addTrack(remoteStream.track);
      room.streams.set(publisherId, mediaStream);
    }

    if (remoteStream.contentType === "video") {
      room.remoteVideoStreams.set(publisherId, remoteStream);

      const remoteAudioStream = room.remoteAudioStreams.get(publisherId);
      const mediaStream = new MediaStream(
        remoteAudioStream === undefined ? [] : [remoteAudioStream.track],
      );
      mediaStream.addTrack(remoteStream.track);
      room.streams.set(publisherId, mediaStream);
    }

    // send back stat as welcome message
    localRoomMember.updateMetadata(
      JSON.stringify({
        type: "stat",
        payload: { ...client.stat, ...media.stat },
      }),
    );
  });

  // 退出時の処理
  confRoom.onMemberLeft.add(({ member }) => {
    const peerId = member.id;
    log("onMemberLeft", peerId);

    if (peerId === localRoomMember.id) {
      // 意図した退出の場合はindexに遷移する
      // ここでは意図しない退出のためリロードしてダイアログを表示させる
      log("I left! please re-enter..");
      notification.showInfo("I left! please re-enter..");

      disposers.forEach((d) => d());

      setTimeout(() => location.reload(), 500);
    }

    const stat = room.stats.get(peerId);
    if (stat) {
      notification.showLeave(stat.displayName);
    }
    room.removeStream(peerId);
  });

  confRoom.onMemberMetadataUpdated.add(({ member, metadata }) => {
    const src = member.id;
    if (src === localRoomMember.id) return;

    const data = JSON.parse(metadata);
    const { type, payload }: RoomData = data;

    switch (type) {
      case "stat": {
        const stat = payload as RoomStat;
        log("on('data/stat')", stat);

        // undefined means first time = just joined
        if (!room.stats.get(src)) {
          notification.showJoin(stat.displayName);
        }
        room.stats.set(src, stat);
        break;
      }
      case "chat": {
        const chat = payload as RoomChat;
        log("on('data/chat')", chat);

        // notify only when chat is closed
        ui.isChatOpen || notification.showChat(chat.from, chat.text);
        room.addRemoteChat(chat);
        break;
      }
      case "reaction": {
        const reaction = payload as RoomReaction;
        notification.showReaction(reaction.from, reaction.reaction);
        break;
      }
      case "cast": {
        const cast = payload as RoomCast;
        log("on('data/cast')", cast);
        room.pinnedId = src;
        notification.showInfo(`Video was casted by ${cast.from}`);
        break;
      }
      default: {
        log(`on('data/unknown') discard...`);
      }
    }
  });

  // 既存のpublicationをsubscribeする
  confRoom.publications.forEach((publication) => {
    if (publication.publisher.id === localRoomMember.id) return;

    log("subscribe published remote stream", publication);
    localRoomMember.subscribe(publication);
  });
};