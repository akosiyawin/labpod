"use client";
import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidV4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/hooks/use-toast";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    if (!voiceType) {
      toast({
        title: "Please provide a voice type to generate a podcast",
        variant: "destructive",
      });
      return setIsGenerating(false);
    }

    if (!voicePrompt) {
      toast({
        title: "Please provide a prompt to generate a podcast",
        variant: "destructive",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        input: voicePrompt,
        voice: voiceType,
      });

      const blob = new Blob([response], {
        type: "audio/mpeg",
      });
      const fileName = `podcast-${uuidV4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId: storageId });
      setAudio(audioUrl!);

      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.error("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-primary-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-primary-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
