import { PostType } from "../../types/post";
import React from "react";
import { getUserPosts } from "../../services/api-requests/getUserPosts";
import { toast } from "react-toastify";
import UserProfileLayout from "../../components/UserProfileLayout";
import { getUserById } from "../../services/api-requests/getUser";
import { useParams } from "react-router-dom";
import { User } from "firebase/auth";

function UserProfile() {
  const params = useParams();
  const [userPosts, setUserPosts] = React.useState<PostType[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const userId = React.useMemo(() => params.id, [params.id]);

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

  React.useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const data = await getUserById(userId);

        if ("error" in data) {
          toast.error(data.error);
        } else {
          setUser(data);
        }
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div>
        <h1>Error, user not found!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">
        {user.displayName} profile
      </h1>
      <UserProfileLayout posts={userPosts} user={user} />
    </div>
  );
}

export default UserProfile;
