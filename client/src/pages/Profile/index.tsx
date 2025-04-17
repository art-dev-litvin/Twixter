import classNames from "classnames";
import Avatar from "../../components/Avatar";
import RemoveAccount from "../../components/RemoveAccount";
import { useAuth } from "../../contexts/auth/Auth.hook";
import Button from "../../components/Button";
import { routes } from "../../constants/routes";
import { PostType } from "../../types/post";
import React from "react";
import { getUserPosts } from "../../services/api-requests/getUserPosts";
import { toast } from "react-toastify";
import PostsGrid from "../../components/PostsGrid";

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = React.useState<PostType[]>([]);

  React.useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        const data = await getUserPosts(user.uid);

        if ("error" in data) {
          toast.error(data.error);
        } else {
          setUserPosts(data.posts);
        }
      };

      fetchUserPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <h1>Error, you need to login first!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">Your profile</h1>
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
          <span className="font-bold">Created posts:</span> {0}
        </p>
      </div>
      <div className="flex gap-4">
        <Button to={routes.editProfile} variant="gray">
          Edit profile
        </Button>
        <RemoveAccount />
      </div>
      <div className="mt-12 pt-12 border-t border-slate-200">
        <PostsGrid posts={userPosts} />
      </div>
    </div>
  );
}

export default Profile;
