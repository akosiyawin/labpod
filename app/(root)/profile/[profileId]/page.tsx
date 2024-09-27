"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcasterProfile from "@/components/PodcasterProfile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

const Profile = ({
  params: { profileId },
}: {
  params: {
    profileId: Id<"users">;
  };
}) => {
  const user = useQuery(api.users.getUserById, { clerkId: profileId });

  const allPodcastData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: profileId,
  });

  if (!user) return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between mb-6">
        <h1 className="text-20 font-bold text-white-1">Podcaster Profile</h1>
      </header>
      <PodcasterProfile user={user} podcasts={allPodcastData?.podcasts} />

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {allPodcastData?.podcasts && allPodcastData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {allPodcastData?.podcasts.map(
              ({ _id, podcastDescription, podcastTitle, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default Profile;
