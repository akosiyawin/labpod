"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { VoiceType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"];

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(5),
});

const CreatePodcast = () => {
  const router = useRouter();
  const createPodcast = useMutation(api.podcasts.createPodcast);

  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioDuration, setAudioDuration] = useState(0);

  const [voiceType, setVoiceType] = useState<VoiceType | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: "Please generate both audio and image before submitting",
          variant: "destructive",
        });
        setIsSubmitting(false);

        return;
      }

      await createPodcast({
        podcastDescription: data.podcastDescription,
        podcastTitle: data.podcastTitle,
        audioUrl,
        imageUrl,
        voicePrompt,
        imagePrompt,
        voiceType,
        audioStorageId: audioStorageId!,
        imageStorageId,
        audioDuration,
        views: 0,
      });
      toast({ title: "Podcast created" });
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating podcast",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Labpod First Podcast"
                      {...field}
                      className="input-class focus-visible:ring-offset-primary-1"
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              <Select onValueChange={(v: VoiceType) => setVoiceType(v)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 capitalize focus-visible:ring-offset-primary-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select AI Voice"
                    className="placeholder:text-gray-1"
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-primary-1">
                  {voiceCategories.map((voice) => (
                    <SelectItem
                      key={voice}
                      value={voice}
                      className="capitalize focus:bg-primary-1"
                    >
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage className="text-white-1" />

                {voiceType && (
                  <audio
                    src={`/voices/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of the podcast."
                      {...field}
                      className="input-class focus-visible:ring-offset-primary-1"
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType as VoiceType}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
            />

            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-primary-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
