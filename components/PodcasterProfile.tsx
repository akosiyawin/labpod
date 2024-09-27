import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";
import { PodcastProps } from "@/types";

const PodcasterProfile = ({
  user,
  podcasts,
}: {
  user: any;
  podcasts: PodcastProps[];
}) => {
  const { setAudio, audio } = useAudio();

  const getRandomElement = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const handlePlay = () => {
    const randomPodcast: PodcastProps = getRandomElement(podcasts);

    if (audio?.podcastId === randomPodcast._id) {
      handlePlay();
    } else {
      setAudio({
        audioUrl: randomPodcast.audioUrl!,
        author: randomPodcast.author,
        imageUrl: randomPodcast.imageUrl!,
        title: randomPodcast.podcastTitle,
        podcastId: randomPodcast._id,
      });
    }
  };

  return (
    <div className="flex gap-6 flex-col sm:items-center sm:flex-row">
      <Image
        src={user.imageUrl}
        className="rounded-xl"
        width={220}
        alt={"profile"}
        height={220}
      />
      <div className="flex flex-col ">
        <div className="flex gap-2 items-center">
          <Icon
            icon="material-symbols:verified"
            fontSize={18}
            className="text-blue-500"
          />
          <span className="text-14 font-light text-white-2">
            Verified Creator
          </span>
        </div>
        <h1 className="mt-1 mb-4 text-32 font-bold text-white-1">
          {user.name}
        </h1>
        <div className="flex gap-2 mb-6">
          <Image
            src={"/icons/headphone.svg"}
            width={24}
            height={24}
            alt="headphone"
          />

          <h2 className="text-16 text-white-1">
            912,000 <span className="text-white-2">monthly listeners</span>
          </h2>
        </div>
        <Button
          onClick={handlePlay}
          className="text-16 w-full max-w-[250px] bg-primary-1 font-extrabold text-white-1"
        >
          <Image
            src="/icons/Play.svg"
            width={20}
            height={20}
            alt="random play"
          />{" "}
          &nbsp; Play a random podcast
        </Button>
      </div>
    </div>
  );
};

export default PodcasterProfile;
