import React from "react";
import classNames from "classnames";
import Avatar from "../Avatar";
import Button from "../Button";
import NewPost from "../NewPost";
import PostsGrid from "../PostsGrid";
import RemoveAccount from "../RemoveAccount";
import { User } from "firebase/auth";
import { routes } from "../../constants/routes";
import { TPost } from "../../types/post";
import { getPostsByUser } from "../../services/api-requests/posts/getPostsByUser";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";

interface UserProfileLayoutProps {
  user: User;
  isOwner: boolean;
}

function UserProfileLayout({ user, isOwner }: UserProfileLayoutProps) {
  const { shouldUpdatePosts, setShouldUpdatePosts } = usePostsUpdates();
  const [userPosts, setUserPosts] = React.useState<TPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);

  const fetchUserPosts = React.useCallback(async () => {
    if (user) {
      setIsLoadingPosts(true);
      const res = await getPostsByUser(user.uid);
      setIsLoadingPosts(false);

      const posts = handleResultWithToast(res);
      if (posts) {
        setUserPosts(posts);
      }
    }
  }, [user]);

  React.useEffect(() => {
    fetchUserPosts();
  }, [user, fetchUserPosts]);

  React.useEffect(() => {
    if (shouldUpdatePosts) {
      fetchUserPosts();
      setShouldUpdatePosts(false);
    }
  }, [shouldUpdatePosts, fetchUserPosts, setShouldUpdatePosts]);

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Avatar src={user.photoURL || undefined} size={100} />
        <div>
          <p className="text-4xl font-medium">{user.displayName || "User"}</p>
          <p
            className={classNames("text-lg mt-1 text-gray-500", {
              "text-green-500": user?.emailVerified,
            })}>
            {user?.emailVerified ? "Email Verified" : "Email Not Verified"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xl">
          <span className="font-bold">Email:</span> {user.email}
        </p>
        <p className="text-xl">
          <span className="font-bold">Created posts:</span> {userPosts.length}
        </p>
      </div>
      {isOwner && (
        <div className="flex gap-4">
          <Button to={routes.editProfile} variant="gray">
            Edit profile
          </Button>
          <RemoveAccount />
        </div>
      )}
      <div className="mt-12 pt-12 border-t border-slate-200">
        {isLoadingPosts && <h3 className="text-lg">Loading posts...</h3>}
        {!isLoadingPosts && userPosts.length > 0 && (
          <PostsGrid posts={userPosts} />
        )}

        {!isLoadingPosts && !userPosts.length && (
          <div>
            <h3 className="text-lg">
              {isOwner
                ? "You don't have posts yet 🦖"
                : "There are no posts yet 🍵"}
            </h3>
            {isOwner && (
              <>
                <h3 className="text-lg mb-3">
                  Do you want to create a new one?
                </h3>
                <NewPost />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default UserProfileLayout;
