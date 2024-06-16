import { useUserContext } from "@/context/AuthContext";
import { Button } from "../button"
import { useParams } from "react-router-dom";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { useGetUserById, useSetFollowerList, useSetToFollowingList } from "@/lib/react-query/queriesAndMutations";
import { checkIsFollowed } from "@/lib/utils";

type FollowMethodProps = {
    toFollowUserData: Models.Document
    canBePressed: boolean
}
 const FollowButton = ({toFollowUserData, canBePressed}: FollowMethodProps) => {
  const { user } = useUserContext();
  const { id } = useParams<{ id: string }>()
  const { data: followerData } = useGetUserById(user.id || "")

  const {mutate: setToFollowingList} = useSetToFollowingList()
  const {mutate: setFollowerList} = useSetFollowerList()

  
  const [following, setFollowing] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([])

  useEffect(() => {
    if (followerData?.following) {
      setFollowing(followerData.following)
    }
  }, [followerData])

  useEffect(() => {
    if (toFollowUserData?.followers) {
      setFollowers(toFollowUserData.followers)
    }
  }, [toFollowUserData])

  
  const handleFollowUser = (e: React.MouseEvent) => {
    if (!canBePressed) return

    e.stopPropagation()
    
    if (!followerData?.$id || !toFollowUserData?.$id) {
      console.error("User IDs are not defined");
      return;
    }

    let newFollowing = [...following]
    let newFollowers = [...followers]

    const hasFollowed = newFollowing.includes(toFollowUserData.$id)

    if(hasFollowed) {
        newFollowing = newFollowing.filter((id) => id !== toFollowUserData.$id)
        newFollowers = newFollowers.filter((id) => id !== followerData.$id)
    } else {
        newFollowing.push(toFollowUserData.$id)
        newFollowers.push(followerData?.$id)
    }

    setFollowing(newFollowing)
    setFollowers(newFollowers)

    setToFollowingList({toFollowId: toFollowUserData.$id, toFollowFollowerList: newFollowers})
    setFollowerList({followerId: followerData?.$id, followerFollowingList: newFollowing})

    console.log("toFollowUserID", toFollowUserData.$id);
    console.log("followerID", followerData.$id);
    console.log("Updated followingList", newFollowing);
    console.log("Updated followersList", newFollowers);
    console.log("Follower Data", checkIsFollowed(newFollowing, toFollowUserData.$id));
  }

  return (
    <div className={`${user.id === id && "hidden"}`}>
        <Button 
          type="button" 
          className="shad-button_primary px-8"
          onClick={handleFollowUser}
          >
          {
            <p>
              {checkIsFollowed(following, toFollowUserData.$id) ? 'Unfollow': 'Follow'}
            </p>
          }
            
        </Button>
    </div>
  )
}

export default FollowButton