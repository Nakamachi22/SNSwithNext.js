import apiClient from "@/app/lib/apiClient";
import { PostType, Profile } from "@/app/types";
import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";

async function getProfileData(userId: string): Promise<Profile> {
  try {
    const response = await apiClient.get(`/user/profile/${userId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error("プロフィールが見つかりません");
  }
}

async function getPostData(userId: string): Promise<PostType[]> {
  try {
    const postsResponse = await apiClient.get(`/posts/${userId}`);
    return postsResponse.data;
  } catch (err) {
    console.log(err);
    throw new Error("プロフィールが見つかりません");
  }
}

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  // `params`をawaitしてから使用
  const { id } = params;

  let profile: Profile;
  let posts: PostType[];

  try {
    profile = await getProfileData(id);
    posts = await getPostData(id);
  } catch (err) {
    // エラーが発生した場合は404ページを表示
    console.log(err);
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="flex items-center">
            <Image
              width="42"
              height="42"
              className="w-20 h-20 rounded-full mr-4"
              src={profile.profileImgUrl}
              alt="User Avatar"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                {profile.user.username}
              </h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          </div>
        </div>
        {posts.map((post: PostType) => (
          <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Image
                  width="42"
                  height="42"
                  className="w-10 h-10 rounded-full mr-2"
                  src={profile.profileImgUrl}
                  alt="User Avatar"
                />
                <div>
                  <h2 className="font-semibold text-md">
                    {post.author.username}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
