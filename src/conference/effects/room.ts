import debug from "debug";
import { reaction, observe } from "mobx";
import { RoomData, RoomStat, RoomCast } from "../utils/types";
import { joinRtcRoom } from "../utils/skyway";
import RootStore from "../stores";
import {
  LocalAudioStream,
  LocalVideoStream,
  LocalRoomMember,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  RoomPublication,
} from "@skyway-sdk/room";

const log = debug("effect:room");

export const joinRoom = async (store: RootStore) => {
  log("joinRoom()");
  const { room, ui, media, client, notification } = store;

  if (room.name === null || room.mode === null) {
    throw ui.showError(new Error("Room name or mode is undefined!"));
  }
  if (room.room === null) {
    throw ui.showError(new Error("Room instance is undefined!"));
  }
  if (room.memberName === null) {
    throw ui.showError(new Error("Room member name is undefined!"));
  }

  const localRoomMember = await joinRtcRoom(room.room, room.memberName).catch(
    (err) => {
      throw ui.showError(err);
    },
  );
  if (localRoomMember === null) {
    throw ui.showError(new Error("Member is not joined!"));
  }
  room.loadMember(localRoomMember);

  log("member instance created");

  // publishする
  media.stream.getAudioTracks().forEach((track) => {
    publishAudio(localRoomMember, track);
  });
  media.stream.getVideoTracks().forEach((track) => {
    publishVideo(localRoomMember, track);
  });

  const confRoom = room.room;
  // must not be happened
  if (confRoom === null) {
    throw ui.showError(new Error("Room is null!"));
  }

  log("joined room", confRoom);

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
      const videoTracks = media.stream.getVideoTracks();
      const videoPublications = localRoomMember.publications.filter(
        (publication) => {
          return publication.contentType === "video";
        },
      );
      if (change.oldValue === null && change.newValue !== null) {
        // video OFF => ON
        videoTracks.forEach((track) => {
          publishVideo(localRoomMember, track);
        });
        return;
      }
      if (change.oldValue !== null && change.newValue !== null) {
        // video ON => ON (device change)
        log("just change video by replaceStream(), no need to re-enter");
        const track = videoTracks[0];
        const stream = new LocalVideoStream(track);
        videoPublications[0].replaceStream(stream);
        return;
      }
      if (change.oldValue !== null && change.newValue === null) {
        // video ON => OFF
        localRoomMember.unpublish(videoPublications[0].id);
        return;
      }
    }),
    observe(media, "videoEffectId", (change) => {
      log("observe(media.videoEffectId)");
      if (!room.isJoined) {
        log("do nothing before room join");
        return;
      }

      // camera OR display was changed, not need to re-enter
      const videoTracks = media.stream.getVideoTracks();
      const videoPublications = localRoomMember.publications.filter(
        (publication) => {
          return publication.contentType === "video";
        },
      );
      if (change.oldValue === null && change.newValue !== null) {
        // video OFF => ON
        // - 処理はvideoDeviceIdのobserve側に任せる
        return;
      }
      if (change.oldValue !== null && change.newValue !== null) {
        // video ON => ON (device change)
        log("just change video by replaceStream(), no need to re-enter");
        const track = videoTracks[0];
        const stream = new LocalVideoStream(track);
        videoPublications[0].replaceStream(stream);
        return;
      }
      if (change.oldValue !== null && change.newValue === null) {
        // video ON => OFF
        // - 処理はvideoDeviceIdのobserve側に任せる
        return;
      }
    }),
    observe(media, "audioDeviceId", (change) => {
      log("observe(media.audioDeviceId)");
      if (!room.isJoined) {
        log("do nothing before room join");
        return;
      }

      // camera OR display was changed, not need to re-enter
      const audioTracks = media.stream.getAudioTracks();
      const audioPublications = localRoomMember.publications.filter(
        (publication) => {
          return publication.contentType === "audio";
        },
      );
      if (change.oldValue === null && change.newValue !== null) {
        // audio OFF => ON
        audioTracks.forEach((track) => {
          publishAudio(localRoomMember, track);
        });
        return;
      }
      if (change.oldValue !== null && change.newValue !== null) {
        // audio ON => ON (device change)
        log("just change audio by replaceStream(), no need to re-enter");
        const track = audioTracks[0];
        const stream = new LocalAudioStream(track);
        audioPublications[0].replaceStream(stream);
        return;
      }
      if (change.oldValue !== null && change.newValue === null) {
        // audio ON => OFF
        localRoomMember.unpublish(audioPublications[0].id);
        return;
      }
    }),
  ];

  const showError = (errorMessage: string) =>
    notification.showError(errorMessage);

  // auto subscribe設定
  confRoom.onStreamPublished.add(({ publication }) => {
    if (publication.publisher.id === localRoomMember.id) return;

    log("onStreamPublished", publication);
    subscribe(localRoomMember, publication, showError);
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
    const memberId = member.id;
    log("onMemberLeft", memberId);

    if (memberId === localRoomMember.id) {
      // 意図した退出の場合はindexに遷移する
      // ここでは意図しない退出のためリロードしてダイアログを表示させる
      log("I left! please re-enter..");
      notification.showInfo("I left! please re-enter..");

      disposers.forEach((d) => d());

      setTimeout(() => location.reload(), 500);
    }

    const stat = room.stats.get(memberId);
    if (stat) {
      notification.showLeave(stat.displayName);
    }
    room.removeStream(memberId);
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
      case "cast": {
        const cast = payload as RoomCast;
        log("on('data/cast')", cast);
        room.pinnedMemberId = src;
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
    subscribe(localRoomMember, publication, showError);
  });
};

const publishAudio = (
  localRoomMember: LocalP2PRoomMember | LocalSFURoomMember,
  track: MediaStreamTrack,
) => {
  log(`publishAudio(${localRoomMember.id}, ${track.id})`);

  const stream = new LocalAudioStream(track);
  localRoomMember.publish(stream);
};

const publishVideo = (
  localRoomMember: LocalP2PRoomMember | LocalSFURoomMember,
  track: MediaStreamTrack,
) => {
  log(`publishVideo(${localRoomMember.id}, ${track.id})`);

  const stream = new LocalVideoStream(track);
  localRoomMember.publish(stream, {
    encodings:
      localRoomMember.roomType === "sfu"
        ? [
            { scaleResolutionDownBy: 4, id: "low", maxBitrate: 100_000 },
            { scaleResolutionDownBy: 1, id: "high", maxBitrate: 400_000 },
          ]
        : [{ scaleResolutionDownBy: 1, id: "high", maxBitrate: 400_000 }],
  });
};

const subscribe = (
  localRoomMember: LocalRoomMember,
  publication: RoomPublication,
  showError: (errorMessage: string) => void,
) => {
  log(`subscribe(${localRoomMember.id}, ${publication.id})`);

  localRoomMember
    .subscribe(
      publication,
      publication.contentType === "video" && localRoomMember.roomType === "sfu"
        ? { preferredEncodingId: "high" }
        : undefined,
    )
    .catch((e) => {
      switch (e.info.name) {
        case "maxSubscribersExceededError":
          showError(
            "送信メディアの受信数が上限値を超えました。システム管理者に連絡してください。",
          );
          break;
      }
    });
};
