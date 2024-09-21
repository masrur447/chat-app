import EmojiPicker from "emoji-picker-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { FaArrowRight, FaRedoAlt } from "react-icons/fa";
import { FaMicrophone, FaPause, FaPlay, FaStop } from "react-icons/fa6";
import { useSelector } from "react-redux";
import GalleryIcon from "../../icons/GalleryIcon";
import SmileIcon from "../../icons/SmileIcon";

function Chatting() {
  const user = useSelector((state) => state.login.user);
  const receiver = useSelector((state) => state.active.active);
  const [message, setMessage] = useState("");
  const [allMesages, setAllMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [blobUrl, setBlobUrl] = useState([]);

  const [recording, setRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blob, setBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [recordsTime, setRecordsTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const db = getDatabase();
  const storage = getStorage();

  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const fileRef = useRef(null);
  const submitRef = useRef(null);
  const playerRef = useRef(null);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  // emoji handler
  const handleEmojis = ({ emoji }) => {
    // Get the current cursor position
    const cursorPos = inputRef.current.selectionStart;

    // Insert the emoji at the cursor position
    setMessage(
      (prevMessage) =>
        prevMessage.slice(0, cursorPos) + emoji + prevMessage.slice(cursorPos),
    );
  };

  // initial voice record
  const initRecording = (e) => {
    e.preventDefault();
    setRecording(true);
    startRecording();
  };

  const stopRecorder = () => {
    stopRecording();
  };

  // handle play pause in recorded audio
  const handlePlayPause = () => {
    if (playerRef.current.paused) {
      setIsPlaying(true);
      playerRef.current.play();
      playerRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        playerRef.current.currentTime = 0;
        setCurrentTime(0);
      });
      playerRef.current.addEventListener("timeupdate", () => {
        // setCurrentTime(playerRef.current.currentTime)
        let currentTimes = playerRef.current.currentTime;
        setCurrentTime(currentTimes);
      });
    } else {
      setIsPlaying(false);
      playerRef.current.pause();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message) {
      set(push(ref(db, "messages")), {
        senderId: user.uid,
        senderName: user.displayName,
        receiverId: receiver.receiverId,
        receiverName: receiver.receiverName,
        message: message,
        type: "text",
      }).then(() => setMessage(""));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    const storageRef = Ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error.message);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "messages")), {
            senderId: user.uid,
            senderName: user.displayName,
            receiverId: receiver.receiverId,
            receiverName: receiver.receiverName,
            message: downloadURL,
            type: "image",
          });
        });
      },
    );
  };

  // restart recording
  const handleVoiceReset = () => {
    setAudioUrl("");
    setDuration(0);
    setRecordsTime(0);
    setBlob(null);
    setRecording(true);
    startRecording();
  };

  const handlesendVoice = () => {
    uploadBytes(Ref(storage, `audio/${new Date().getTime()}.mp3`), blob).then(
      (res) => {
        getDownloadURL(res.ref).then((url) => {
          set(push(ref(db, "messages")), {
            senderId: user.uid,
            senderName: user.displayName,
            receiverId: receiver.receiverId,
            receiverName: receiver.receiverName,
            message: url,
            type: "voice",
          }).then(() => {
            setRecording(false);
            setAudioUrl("");
            setDuration(0);
            setRecordsTime(0);
            setBlob(null);
          });
        });
      },
    );
  };
  // get all messages
  useEffect(() => {
    stopRecording();
    setRecording(false);
    setAudioUrl("");
    setDuration(0);
    setRecordsTime(0);
    setBlob(null);
    const startCountRef = ref(db, "messages");
    onValue(startCountRef, (snapshot) => {
      const messageArray = [];
      snapshot.forEach((item) => {
        if (
          (item.val().receiverId === receiver?.receiverId &&
            item.val().senderId === user.uid) ||
          (item.val().receiverId === user.uid &&
            item.val().senderId === receiver?.receiverId)
        ) {
          messageArray.push(item.val());
        }
      });
      setAllMessages(messageArray);
    });
  }, [receiver?.receiverId]);

  // scroll into bottom
  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [db, storage, message, allMesages]);

  // audio blob
  useEffect(() => {
    setBlob(null);
    if (!recordingBlob) return;
    setBlob(recordingBlob);
    let url = URL.createObjectURL(recordingBlob);
    if (url) setAudioUrl(url);
  }, [recordingBlob]);

  // convert recording time to minutes
  useEffect(() => {
    if (!recordingTime) return;

    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;

    let min = 0;
    let sec = 0;

    if (minutes < 10) {
      min = `0${minutes}`;
    } else {
      min = minutes;
    }

    if (seconds < 10) {
      sec = `0${seconds}`;
    } else {
      sec = seconds;
    }
    setRecordsTime(`${min}:${sec}`);
  }, [recordingTime]);

  return (
    <div className="w-full bg-white">
      <div className="bg-black py-4 px-6 rounded-t-md">
        <div className="flex items-center gap-x-2">
          <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden">
            <img
              src={receiver?.receiverProfile || "https://i.pravatar.cc/300"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-white font-semibold text-lg">
            {receiver?.receiverName || "Anonymous"}
          </h3>
        </div>
      </div>

      <div
        className="w-full h-[600px] bg-red-400 px-2 py-3 overflow-y-auto"
        ref={messageRef}
      >
        {allMesages?.map((item, i) => (
          <div key={i}>
            {item.senderId !== user.uid ? (
              <>
                {/* receiver message */}
                {item.type === "text" && (
                  <div className="max-w-[80%] py-3 mr-auto flex flex-col items-start">
                    <div className="bg-slate-500 min-w-10 rounded-md px-2 py-3 pb-6 relative">
                      <p className="text-base font-serif text-white">
                        {item.message}
                      </p>
                      <span className="text-xs font-semibold text-gray-200 absolute bottom-1 right-1">
                        12:00
                      </span>
                    </div>
                  </div>
                )}
                {/* receiver image */}
                {item.type === "image" && (
                  <div className="max-w-[400px] h-auto mr-auto flex flex-col items-start py-3">
                    <img
                      src={item.message}
                      alt=""
                      className="rounded-md w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* receiver voice */}
                {item.type === "voice" && (
                  <div className="max-w-[80%] h-auto ml-auto flex flex-col items-end py-3">
                    <audio src={item.message} controls aria-disabled />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* sender message */}
                {item.type === "text" && (
                  <div className="max-w-[80%] py-3 ml-auto flex flex-col items-end">
                    <div className="bg-blue-500 min-w-10 rounded-md px-2 py-3 pb-6 relative">
                      <p className="text-base font-serif text-white">
                        {item.message}
                      </p>
                      <span className="text-xs font-semibold text-gray-200 absolute bottom-1 right-1">
                        12:00
                      </span>
                    </div>
                  </div>
                )}
                {/* sender image */}
                {item.type === "image" && (
                  <div className="max-w-[400px] h-auto ml-auto flex flex-col items-end py-3">
                    <img
                      src={item.message}
                      alt=""
                      className="rounded-md w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* sender voice */}
                {item.type === "voice" && (
                  <div className="max-w-[80%] h-auto ml-auto flex flex-col items-end py-3">
                    <audio src={item.message} controls aria-disabled />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {receiver && (
        <>
          <div className={`bg-[#F5F5F5] px-2 py-4 ${recording && "hidden"}`}>
            <div className="bg-white max-w-[530px] w-full rounded-md mx-auto py-3 flex items-center justify-center gap-x-8">
              <div className="flex items-center justify-center gap-x-1 relative">
                <button onClick={initRecording}>
                  <FaMicrophone size={22} />
                </button>
                <button onClick={() => setShowEmoji((prev) => !prev)}>
                  <SmileIcon />
                  {showEmoji && (
                    <div className="absolute bottom-11 -left-4">
                      <EmojiPicker
                        open={showEmoji}
                        lazyLoadEmojis={true}
                        onEmojiClick={handleEmojis}
                      />
                    </div>
                  )}
                </button>
                <button onClick={() => fileRef.current.click()}>
                  <span>
                    <GalleryIcon />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    hidden
                    ref={fileRef}
                  />
                </button>
              </div>
              <input
                type="text"
                ref={inputRef}
                value={message}
                onKeyUp={(e) => e.key === "Enter" && submitRef.current.click()}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type someting"
                className="w-3/5 outline-none"
              />
              <button
                ref={submitRef}
                className="bg-primary px-4 py-2 rounded text-white outline-none"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>

          {/* record voice with visulizer effect */}
          {isRecording && (
            <div className="bg-[#F5F5F5] px-2 py-4 flex justify-center items-center gap-x-3">
              <div
                className="bg-primary p-2 rounded-full cursor-pointer text-white"
                onClick={() => togglePauseResume()}
              >
                {!isPaused && <FaPause />}
                {isPaused && <FaPlay />}
              </div>
              <div className="text-gray-500 text-sm">{recordsTime}</div>

              <div>
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorder}
                  width={300}
                  height={40}
                  barWidth={5}
                />
              </div>

              <div
                className="bg-primary p-2 rounded-full cursor-pointer text-white"
                onClick={stopRecorder}
              >
                <FaStop />
              </div>
            </div>
          )}
          {/* play voice after close the recorder */}
          {!isRecording && blob && (
            <>
              <div className="bg-[#F5F5F5] px-2 py-4 flex justify-center items-center gap-x-3">
                <div className="bg-primary p-2 rounded-full cursor-pointer text-white">
                  {isPlaying ? (
                    <span onClick={handlePlayPause}>
                      <FaPause />
                    </span>
                  ) : (
                    <span onClick={handlePlayPause}>
                      <FaPlay />
                    </span>
                  )}
                </div>
                <div>{duration}</div>
                <div>
                  <AudioVisualizer
                    blob={blob}
                    width={300}
                    height={75}
                    barWidth={1}
                    barColor={"red"}
                    currentTime={currentTime}
                    barPlayedColor={"green"}
                  />
                  <audio src={audioUrl} ref={playerRef} hidden></audio>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                  {/* restart voice reorder */}
                  <button
                    className="bg-primary p-2 rounded-full cursor-pointer text-white"
                    onClick={handleVoiceReset}
                  >
                    <FaRedoAlt />
                  </button>
                  {/* send button */}
                  <button
                    className="bg-primary p-2 rounded-full cursor-pointer text-white"
                    onClick={handlesendVoice}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Chatting;
